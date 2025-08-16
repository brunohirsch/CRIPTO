import { useEffect } from 'react';

export default function CmcWidgets() {
  useEffect(() => {
    const marqueeScript = document.createElement('script');
    marqueeScript.type = 'text/javascript';
    marqueeScript.src = 'https://files.coinmarketcap.com/static/widget/coinMarquee.js';
    document.body.appendChild(marqueeScript);

    const priceScript = document.createElement('script');
    priceScript.type = 'text/javascript';
    priceScript.src = 'https://files.coinmarketcap.com/static/widget/coinPriceBlock.js';
    document.body.appendChild(priceScript);

    return () => {
      document.body.removeChild(marqueeScript);
      document.body.removeChild(priceScript);
    };
  }, []);

  return (
    <div style={{display:'grid', gap:12}}>
      <div id="coinmarketcap-widget-marquee"
           coins="1,1027,5426,7278,1975,2010,4642,20947,5690,8916,2280,5450,5994,10804,24478,74"
           currency="USD" theme="dark" transparent="false" show-symbol-logo="true" />
      <div id="coinmarketcap-widget-coin-price-block"
           coins="1,1027,5426,7278,1975,2010,5450,20947,4642,5690,8916,2280,24478,74,5994,10804"
           currency="USD" theme="dark" transparent="false" show-symbol-logo="true" />
    </div>
  );
}
