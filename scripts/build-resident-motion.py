"""Extract Mixamo motion only from the pinned official Three.js Xbot example.
Keeps this app's resident mesh; does not distribute the example character model.
"""
import array,hashlib,json,pathlib,struct,urllib.request,math
ROOT=pathlib.Path(__file__).resolve().parents[1]
SOURCE='https://raw.githubusercontent.com/mrdoob/three.js/d4aa9e00ea29808534a3e082f602c544e5f2419c/examples/models/gltf/Xbot.glb'
MAP={'Hips':'hips','Spine':'spine','Spine1':'chest','Spine2':'upperChest','Neck':'neck','Head':'head'}
for side in ['Left','Right']:
    prefix=side.lower()
    for mixamo,human in [('Shoulder','Shoulder'),('Arm','UpperArm'),('ForeArm','LowerArm'),('Hand','Hand'),('UpLeg','UpperLeg'),('Leg','LowerLeg'),('Foot','Foot'),('ToeBase','Toes')]:MAP[side+mixamo]=prefix+human
    for finger in ['Thumb','Index','Middle','Ring','Pinky']:
        for number,part in enumerate(['Proximal','Intermediate','Distal'],1):
            targetfinger='Little' if finger=='Pinky' else finger
            targetpart=(['Metacarpal','Proximal','Distal'][number-1] if finger=='Thumb' else part)
            MAP[f'{side}Hand{finger}{number}']=prefix+targetfinger+targetpart

def mul(a,b):
    x,y,z,w=a;X,Y,Z,W=b
    return [w*X+x*W+y*Z-z*Y,w*Y-x*Z+y*W+z*X,w*Z+x*Y-y*X+z*W,w*W-x*X-y*Y-z*Z]
def inv(q):return [-q[0],-q[1],-q[2],q[3]]
def main():
    data=urllib.request.urlopen(SOURCE,timeout=40).read();n,_=struct.unpack_from('<II',data,12);doc=json.loads(data[20:20+n]);size,_=struct.unpack_from('<II',data,20+n);binary=data[28+n:28+n+size]
    parents={child:index for index,node in enumerate(doc['nodes']) for child in node.get('children',[])}
    def world(index):
        local=doc['nodes'][index].get('rotation',[0,0,0,1]);return mul(world(parents[index]),local) if index in parents else local
    def accessor(index):
        a=doc['accessors'][index];view=doc['bufferViews'][a['bufferView']];width={'SCALAR':1,'VEC3':3,'VEC4':4}[a['type']];assert a['componentType']==5126
        offset=view.get('byteOffset',0)+a.get('byteOffset',0);stride=view.get('byteStride',width*4)
        return [v for i in range(a['count']) for v in struct.unpack_from('<'+'f'*width,binary,offset+i*stride)]
    clips={}
    for animation in doc['animations']:
        if animation['name'] not in ['idle','walk','run','agree']:continue
        tracks=[];duration=0
        for channel in animation['channels']:
            index=channel['target']['node'];kind=channel['target']['path'];name=doc['nodes'][index].get('name','').split(':')[-1];human=MAP.get(name)
            if not human or (kind!='rotation' and not(kind=='translation' and human=='hips')):continue
            sampler=animation['samplers'][channel['sampler']];times=accessor(sampler['input']);values=accessor(sampler['output']);duration=max(duration,max(times))
            if kind=='rotation':
                parent=world(parents[index]) if index in parents else [0,0,0,1];rest=inv(world(index));values=[v for i in range(0,len(values),4) for v in mul(mul(parent,values[i:i+4]),rest)]
            else:
                values=[v*.01 for v in values]
                means=[sum(values[k::3])/(len(values)//3) for k in range(3)]
                values=[v-means[i%3]+(1.0399147033691406 if i%3==1 else 0) for i,v in enumerate(values)]
            tracks.append({'bone':human,'path':kind,'times':[round(v,6)for v in times],'values':[round(v,7)for v in values]})
        clips[animation['name']]={'duration':duration,'tracks':tracks}
    out=ROOT/'assets/avatar/motion';out.mkdir(parents=True,exist_ok=True)
    payload={'format':'secha-vrm-motion-v1','source':'Mixamo / Three.js Xbot example','sourceURL':SOURCE,'sourceSHA256':hashlib.sha256(data).hexdigest(),'terms':'https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html','restHipsHeight':1.0399147033691406,'strideSpeed':{'walk':1.35,'run':2.8},'clips':clips}
    (out/'mixamo-motion.json').write_text(json.dumps(payload,separators=(',',':'))+'\n')
    print('Motion clips:',{key:len(value['tracks'])for key,value in clips.items()},'bytes:',(out/'mixamo-motion.json').stat().st_size)
if __name__=='__main__':main()
