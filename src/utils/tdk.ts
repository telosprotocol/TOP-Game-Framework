function getOrCreateMetaEl(id, attrTuples: [string, string][]) {
  const existEl = document.getElementById(id);
  if (existEl) {
    return existEl;
  }
  const el = document.createElement('meta');
  el.id = id;
  attrTuples.forEach(([attrName, attrValue]) => {
    el.setAttribute(attrName, attrValue);
  });
  document.head.appendChild(el);
  return el;
}
/**
 *      tdk    og  （  ，id     ID)
 * @param metaType
 * @param content
 */
export function setMetaInfo(
  metaType: 'description' | 'title',
  content: string
) {
  const metaUpperName = metaType.toUpperCase();

  if (metaType === 'title') {
    document.title = content;
  } else {
    const tdkEl = getOrCreateMetaEl(`TDK_${metaUpperName}`, [
      ['name', 'description'],
    ]);
    tdkEl.setAttribute('content', content);
  }
  setOgMetaInfo(metaType, content);
}

export function setOgMetaInfo(
  metaType: 'description' | 'title' | 'image',
  content: string
) {
  const ogEl = getOrCreateMetaEl(`OG_${metaType.toUpperCase()}`, [
    ['property', `og:${metaType}`],
  ]);
  ogEl.setAttribute('content', content);
}

export function autoSetDtk(lang: 'en' | 'id') {
  //       （         remote.html)
  if (lang === 'en') {
    const description =
      'Free! Free! Free! You can watch HD new movies for free immediately on VGame!';
    setMetaInfo('description', description);
  }
}
