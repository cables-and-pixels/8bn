import { useEffect, useRef } from 'react';
import Link from 'next/link'

export default function Token(props) {
  const t = props.token;
  const cRef = useRef(null);
  const size = props.size || 64;

  useEffect(() => {
    const rgb = t.rgb.match(/.{1,6}/g).map((x) => '#' + x);
    const c = cRef.current;
    const ctx = c.getContext('2d');
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y <8; y++) {
        ctx.fillStyle = rgb[x + y * 8];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });

  let canvas = (
    <canvas title={t.creater} ref={cRef} width={8} height={8} style={{
      imageRendering: 'pixelated',
      width: size + 'px',
      height: size + 'px',
    }} />
  );

  if (props.link) {
    canvas = <Link href={props.link}><a>{canvas}</a></Link>;
  }

  return canvas;
}
