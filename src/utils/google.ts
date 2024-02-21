export function getGoogleFirstPageRlt2(html: string) {
  //     ，     "dimg_X"
  const bodyHtml =
    '<body>' + html.split('</body>')[0].split('<body')[1] + '</body>';
  const htmlNode = document.createElement('html');
  htmlNode.innerHTML = bodyHtml;
  const items: any[] = [];
  //
  htmlNode.querySelectorAll('.ucBsPc').forEach((elem) => {
    const title = elem.querySelector<HTMLElement>('.V82bz')?.innerText;
    const author = elem.querySelector<HTMLElement>('.dDuYUe')?.innerText;
    const time = elem.querySelector<HTMLElement>('.sE3Tte span')?.innerText;
    const parent = elem.parentNode;

    const duration = parent?.querySelector<HTMLElement>('.ZWiQ5')?.innerText;
    const href = (parent?.parentNode as HTMLElement)?.getAttribute('href');
    const img = parent?.querySelector('img');
    const imgId = img?.getAttribute('id');
    const imgSrc = img?.getAttribute('src');
    items.push({
      imgSrc: imgSrc,
      imgId: imgId,
      link: href,
      duration: duration,
      title: title,
      from: '',
      author: author,
      time: time,
    });
  });
  const dicImgSrc: any = {};
  for (let i = 0; i < items.length; i++) {
    const imgId = items[i].imgId;
    const subReg = new RegExp(
      "'[^']*';[\\s]*var ii[ ]*=[ ]*\\[[^[]*'" + imgId + "'"
    );
    //img source
    let match = html.match(subReg);
    let src = '';
    if (!match) {
      const subReg2 = new RegExp('"' + imgId + '":"[^"]*"');
      match = html.match(subReg2);
      src = match?.[0].split('"')[3];
    } else {
      src = match[0].split("'")[1];
    }
    dicImgSrc[imgId] = src;
  }
  for (let i = 0; i < items.length; i++) {
    const imgId = items[i].imgId;
    if (dicImgSrc[imgId]) {
      // console.log("before decode:", dicImgSrc[imgId])
      items[i].imgSrc = dicImgSrc[imgId]
        .replace(/\\x3d/g, '=')
        .replace(/\\u003d/g, '=')
        .replace(/\\x26/g, '&')
        .replace(/\\u0026/g, '&');
      // console.log("after decode:", items[i].imgSrc)
    } else {
      // console.log("before decode:", items[i].imgSrc)
      items[i].imgSrc = items[i].imgSrc
        .replace(/\\x3d/g, '=')
        .replace(/\\u003d/g, '=')
        .replace(/\\x26/g, '&')
        .replace(/\\u0026/g, '&');
      // console.log("after decode:", items[i].imgSrc)
    }
  }

  //
  const nextHref = htmlNode
    .querySelector('#botstuff a[href]')
    ?.getAttribute('href');

  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    console.log('getGoogleFirstPageRlt2', {
      items,
      associatedItems: [] as unknown[],
      nextHref,
    });
  }

  return {
    items,
    associatedItems: [] as unknown[],
    nextHref,
  };
}
export function getGoogleMorePageRlt2(html: string) {
  html = unescape(html.replace(/\\/g, '%'));
  const tmpHtml =
    '<div data-ved' +
    html.split('<script nonce="')[0].split('<div data-ved')[1];
  const tmpElem = document.createElement('div');
  tmpElem.innerHTML = tmpHtml;
  const items: {
    imgSrc: string;
    link: string;
    duration: string;
    title: string;
    from: string;
    author: string;
    time: string;
  }[] = [];
  tmpElem.querySelectorAll<HTMLImageElement>('.lKXK9 img').forEach((img) => {
    // console.log("before decode:", img.src)
    const src = img.src
      .replace(/\\x3d/g, '=')
      .replace(/\\u003d/g, '=')
      .replace(/\\x26/g, '&')
      .replace(/\\u0026/g, '&');
    // console.log("after decode:", src)
    items.push({
      imgSrc: src,
      link: '',
      duration: '',
      title: '',
      from: '',
      author: '',
      time: '',
    });
  });

  const itemNodes = tmpElem.querySelectorAll<HTMLLinkElement>('.lKXK9');
  let i = 0;
  itemNodes.forEach((itemNode) => {
    //link
    let link = '';
    const a = itemNode.parentNode;
    if (a) {
      link = (a as HTMLLinkElement).href;
    }
    //duration
    const Hin2Bc = itemNode.querySelector<HTMLElement>('[role="presentation"]');
    let duration = '';
    if (Hin2Bc) {
      duration = Hin2Bc.innerText;
    }
    //time
    const kUSUrf = itemNode.querySelector<HTMLElement>('[role="heading"]');
    let title = '';
    if (kUSUrf) {
      title = kUSUrf.innerText;
    }
    //source
    // let cite = itemNode.querySelector('cite')
    //let from = ''
    // if (cite) {
    //   from = itemNode.querySelector('cite').innerText
    // }
    //author
    let author = '';
    const dDuYUe = itemNode.querySelector<HTMLElement>('.dDuYUe');
    if (dDuYUe) {
      author = dDuYUe.innerText;
    }
    //time
    const nk7hbe = itemNode.querySelector<HTMLElement>('[class="sE3Tte"]');
    let time = '';
    if (nk7hbe) {
      time = nk7hbe.innerText;
    }
    items[i].link = link.replace(
      (document as any).origin,
      'https://www.google.com'
    );
    items[i].duration = duration;
    items[i].title = title;
    items[i].from = '';
    items[i].author = author;
    items[i].time = time;

    i++;
  });
  if (process.env.VUE_APP_ENV_LOCAL_DEBUG) {
    console.log('getGoogleMorePageRlt2', {
      items,
      associatedItems: [] as unknown[],
    });
  }
  return {
    items,
    associatedItems: [] as unknown[],
  };
}
