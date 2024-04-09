import satori from 'satori';
import sharp from 'sharp';

// サイト名
const site = 'ロンギの家';
const url = 'astro-notion-blog-876.pages.dev/';

// ユーザー
const user = 'ロンギ';
const x = '@ronginooth';

export async function getOgImage(title: string) {
  const fontData = (await getFontData()) as ArrayBuffer;
  const svg = await satori(
    <div
      style={{
        width: '1200px',
        height: '630px',
 //       backgroundColor: '#52ACFF',
 backgroundImage: 'url(https://astro-notion-blog-876.pages.dev/default-og-image.png)',
       // backgroundImage: 'url(https://blog-imgs-173.fc2.com/y/e/l/yellowmoneymonkey/bg-image.jpg)',
 //       backgroundImage: 'linear-gradient(225deg, #52ACFF 34%, #FFE32C 100%)',
        display: 'flex',
        borderRadius: '8px',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
        <div
        tw="flex flex-col w-full px-15 py-12 justify-between border"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(80,80,80,0.8) 0%, rgba(120,120,120,0.9) 100%)",
        }}
      >
        
        {/* <div
        style={{
          display: 'flex',
          width: '1140px',
          height: '567px',
          backgroundImage:
            "linear-gradient(0deg, rgba(200,200,200,0.8) 0%, rgba(250,250,250,0.9) 100%)",
        //  background: 'rgba(255,255,255,0.7)',
          borderRadius: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      > */}
        <h1 tw="text-5xl text-gray-100">{title}</h1>
        <div tw="flex justify-between items-center">
          <p tw="items-center">
            <img
              tw="h-12 w-12 rounded-full border border-gray-300"
              src="https://avatars.githubusercontent.com/u/4057085?v=4"
              alt="icon"
            />
            <span tw="ml-3 text-gray-100 text-lg">ronginooth</span>
          </p>
          <p tw="text-gray-100 pr-7">https://ronginooth.com</p>
        </div>
        {/* <div
          style={{
            width: '960px',
            height: '80%',
            fontSize: '64px',
            color: '#222',
            textShadow: '2px 2px 3px #d5d5d5',
            alignItems: 'center',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            width: '960px',
            paddingBottom: '4px',
            height: '40px',
            fontSize: '2rem',
          }}
        >
          {site + x}
        </div> */}
        <div
          style={{
            flexBasis: '54%',
            marginRight: '5.5rem',
            display: 'flex',
          }}
        ></div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}

async function getFontData() {
  const API = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700`;

  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (!resource) return;

  return await fetch(resource[1]).then((res) => res.arrayBuffer());
}