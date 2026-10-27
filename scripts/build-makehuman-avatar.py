"""Bake the pinned CC0 MakeHuman hm08 mesh/rig into a local, clothed web asset.
No MakeHuman application code is redistributed. Requires Python standard library.
"""
import array, hashlib, json, math, pathlib, urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/avatar'
REV='a8bc2d54ff0ac92e78ff71431b1023eda42bf482'
BASE=f'https://raw.githubusercontent.com/makehumancommunity/makehuman/{REV}/'
FILES={'base.obj':'makehuman/data/3dobjs/base.obj','rig.json':'makehuman/data/rigs/default.mhskel','weights.json':'makehuman/data/rigs/default_weights.mhw','LICENSE.ASSETS.md':'LICENSE.ASSETS.md'}
def main():
    OUT.mkdir(parents=True,exist_ok=True)
    sources={key:urllib.request.urlopen(BASE+path,timeout=40).read() for key,path in FILES.items()}
    (OUT/'LICENSE.ASSETS.md').write_bytes(sources['LICENSE.ASSETS.md'])
    vertices=[];groups={};name=''
    for line in sources['base.obj'].decode().splitlines():
        if line.startswith('v '):vertices.append(list(map(float,line.split()[1:4])))
        elif line.startswith('g '):name=line[2:];groups.setdefault(name,[])
        elif line.startswith('f '):groups[name].append([int(v.split('/')[0])-1 for v in line.split()[1:]])
    rig=json.loads(sources['rig.json']);weights=json.loads(sources['weights.json'])['weights']
    names=list(rig['bones']);bone_index={name:i for i,name in enumerate(names)}
    low=min(vertices[i][1] for face in groups['body'] for i in face)
    high=max(vertices[i][1] for face in groups['body'] for i in face)
    scale=1.72/(high-low)
    def position(v):return [v[0]*scale,(v[1]-low)*scale,v[2]*scale]
    joints={name:[sum(vertices[i][k] for i in ids)/len(ids) for k in range(3)] for name,ids in rig['joints'].items()}
    bones=[{'name':name,'parent':bone_index.get(rig['bones'][name]['parent'],-1),'head':position(joints[rig['bones'][name]['head']])} for name in names]
    influences=[[] for _ in vertices]
    for name,rows in weights.items():
        for index,value in rows:influences[index].append((bone_index[name],value))
    positions=[];skin_indices=[];skin_weights=[];indices=[];sections=[]
    for part,material in [('body',0),('helper-tights',1),('helper-tights',2),('helper-tights',3),('helper-hair',4)]:
        start=len(indices);mapping={}
        for face in groups[part]:
            center=[sum(vertices[i][k] for i in face)/len(face) for k in range(3)]
            x,y,z=center
            if part=='body' and not (y>4.7 or (abs(x)>3.8 and y<2.3)):continue
            if part=='helper-hair' and y<7.65:continue
            if part=='helper-tights':
                if abs(x)>4.1 or y>5.75:continue
                region=3 if y<-7.15 else 2 if y<-.25 else 1
                if material!=region:continue
            for index in face:
                if index not in mapping:
                    point=position(vertices[index])
                    if part=='helper-hair':
                        point[0]*=1.07;point[1]=1.62+(point[1]-1.62)*1.04;point[2]=.04+(point[2]-.04)*1.08
                    if part=='helper-tights':
                        point[0]*=1.035
                        point[2]+=.012 if point[2]>0 else -.012
                    mapping[index]=len(positions)//3;positions.extend(point)
                    row=sorted(influences[index],key=lambda v:v[1],reverse=True)[:4] or [(bone_index['root'],1)]
                    total=sum(value for _,value in row)
                    skin_indices.extend([bone for bone,_ in row]+[0]*(4-len(row)))
                    skin_weights.extend([value/total for _,value in row]+[0]*(4-len(row)))
            for k in range(1,len(face)-1):indices.extend([mapping[face[0]],mapping[face[k]],mapping[face[k+1]]])
        sections.append({'start':start,'count':len(indices)-start,'material':material})
    binary=bytearray();buffers={}
    for name,typecode,data in [('position','f',positions),('skinIndex','H',skin_indices),('skinWeight','f',skin_weights),('index','H',indices)]:
        while len(binary)%4:binary.append(0)
        values=array.array(typecode,data)
        import sys
        if sys.byteorder!='little':values.byteswap()
        buffers[name]={'offset':len(binary),'length':len(data)};binary.extend(values.tobytes())
    (OUT/'resident.bin').write_bytes(binary)
    meta={'format':'secha-makehuman-v1','height':1.72,'revision':REV,'license':'CC0-1.0','source':BASE+FILES['base.obj'],'sha256':{key:hashlib.sha256(value).hexdigest() for key,value in sources.items()},'binarySha256':hashlib.sha256(binary).hexdigest(),'buffers':buffers,'groups':sections,'bones':bones,'materials':['skin','shirt','trousers','shoes','hair']}
    (OUT/'resident.json').write_text(json.dumps(meta,separators=(',',':'))+'\n')
    print(f'Baked {len(positions)//3} vertices, {len(indices)//3} triangles, {len(bones)} bones, {len(binary)} bytes')
if __name__=='__main__':main()
