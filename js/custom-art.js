/* Custom commissions: prepare a brief locally; the visitor sends it in WhatsApp. */
(() => {
  const section=document.getElementById('custom-art');if(!section)return;
  const get=id=>document.getElementById(id);
  const directions={
    'sculpted-art': {name:'Sculpted 3D paintings', title:'A painting with\npresence.', description:'Deep sculpted relief, raised brushwork and hand-painted colour. A tactile artwork that catches the light and becomes the centrepiece of your home.', materials:'Sculpted relief · Layered impasto · Hand-painted canvas', alt:'Large sculpted relief painting with raised ivory folds and a terracotta painted band above an empty walnut bench'},
    'painted-walls': {name:'Painted walls & murals', title:'Let the wall\nbe the artwork.', description:'A hand-painted composition made for your architecture. Expressive brushwork and layered colour turn a whole wall into a personal statement.', materials:'Hand-painted murals · Mineral pigments · Textured wall finishes', alt:'Hand-painted indigo, ochre and terracotta abstract mural across a residential plaster wall with an empty oak bench'},
    'hand-painted-art': {name:'Hand-painted art', title:'An original,\nonly yours.', description:'Original brushwork, richly textured paint and a composition created for your room. A singular canvas, framed and scaled to take its place at the heart of your home.', materials:'Original painting · Palette-knife texture · Bespoke framing', alt:'Walnut-framed hand-painted abstract canvas with burgundy, clay and cobalt paint, raised strokes and visible linen texture'},
  };
  let current='sculpted-art',palette='Mineral';
  section.querySelectorAll('[data-art]').forEach((button,index)=>button.addEventListener('click',()=>{
    current=button.dataset.art;const item=directions[current];
    section.querySelectorAll('[data-art]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
    get('art-image').src=`assets/art/${current}.webp`;get('art-image').alt=item.alt;
    get('art-title').textContent=item.title;get('art-title').style.whiteSpace='pre-line';
    get('art-description').textContent=item.description;get('art-materials').textContent=item.materials;
    get('art-image-caption').textContent=`0${index+1} / ${item.name}`;
    get('art-announcement').textContent=`${item.name} selected. ${item.materials}.`;
  }));
  section.querySelectorAll('[data-art-palette]').forEach(button=>button.addEventListener('click',()=>{
    palette=button.dataset.artPalette;section.querySelectorAll('[data-art-palette]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
    get('art-announcement').textContent=`${palette} colour direction selected for your brief.`;
  }));
  const dialog=get('art-brief-dialog');
  get('art-commission').addEventListener('click',()=>{
    get('art-brief-type').value=current;get('art-brief-palette').value=palette;
    get('art-brief-form').hidden=false;get('art-brief-result').hidden=true;
    document.body.classList.add('art-brief-open');dialog.showModal();
  });
  get('art-brief-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.classList.remove('art-brief-open');get('art-commission').focus();});
  get('art-brief-form').addEventListener('submit',event=>{
    event.preventDefault();if(!event.target.reportValidity())return;
    const item=directions[get('art-brief-type').value];
    const brief=`Hello SECHA, I’d like to discuss a custom commission.\n\nCommission: ${item.name}\nSize / pieces: ${get('art-brief-size').value.trim()}\nColour direction: ${get('art-brief-palette').value}\nIdeas: ${get('art-brief-notes').value.trim() || 'To explore together'}\n\nPlease help confirm the scope, materials, price and timing.`;
    get('art-brief-summary').textContent=brief;
    get('art-whatsapp').href=`https://wa.me/6287786010290?text=${encodeURIComponent(brief)}`;
    event.target.hidden=true;get('art-brief-result').hidden=false;get('art-whatsapp').focus();
  });
  get('art-brief-edit').addEventListener('click',()=>{get('art-brief-result').hidden=true;get('art-brief-form').hidden=false;get('art-brief-size').focus();});
})();
