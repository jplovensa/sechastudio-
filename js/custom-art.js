/* Custom commissions: prepare a brief locally; the visitor sends it in WhatsApp. */
(() => {
  const section=document.getElementById('custom-art');if(!section)return;
  const get=id=>document.getElementById(id);
  const directions={
    'painted-walls': {name:'Painted walls', title:'Let the wall\nbe the artwork.', description:'Expressive brushwork, mineral colour and a composition made for your architecture. From a quiet gesture to a full-room statement.', materials:'Limewash · Hand-painted murals · Textured finishes', alt:'Hand-painted ochre and charcoal mural on a textured plaster wall with a walnut bench'},
    'original-art': {name:'Original art', title:'A piece with\na point of view.', description:'Original compositions, tactile surfaces and considered framing. A personal work of art, scaled to the place it will call home.', materials:'Original painting · Textured relief · Bespoke framing', alt:'Framed ivory relief painting and a smaller charcoal composition on a walnut console'},
    'home-accessories': {name:'Home accessories', title:'Objects to\nlive with.', description:'Sculptural vessels, tactile textiles and useful little treasures. A considered edit of pieces that gives your room its own rhythm.', materials:'Hand-built ceramics · Sculptural objects · Natural textiles', alt:'Hand-built terracotta and chalk-white vessels with a timber bowl and flax linen on travertine'},
  };
  let current='painted-walls',palette='Mineral';
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
