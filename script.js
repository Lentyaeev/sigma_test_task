function mainScript() {
  const iframeStyle = `
  display: none !important; 
  position: fixed !important;
  font-family: Helvetica, sans-serif !important;
  z-index: 2147483645 !important; 
  left: 0 !important;
  top: 0 !important;
  width: 100% !important; 
  height: 100% !important; 
  overflow: auto !important; 
  background-color: rgb(0,0,0) !important; 
  background-color: rgba(0,0,0,0.4) !important; 
  `;
  const buttonStyle = `
  font-family: Helvetica, sans-serif !important;
  position: fixed !important;
  right: 10px !important;
  bottom: 10px !important;
  height: 70px !important;
  width: 70px !important;
  border-radius: 50% !important;
  background-color: black !important;
  text-align: center !important;
  cursor: pointer !important;
  color: #fff !important;
  z-index: 2147483647 !important;
  border: 4px solid #ffbb00;
  padding: 0px;
  margin: 0px;
  `;
  const divContentStyle = `
  background-color: #fefefe;
  margin: 15% auto; 
  padding: 10px;
  border: 1px solid #888;
  width: 80%; 
  font-family: Helvetica, sans-serif;
  `;
  const headingDivStyle = `
  display: block;
  text-align: center;
  background-color: #ff8000;
  font-size: 1.8rem;
  font-family: Helvetica, sans-serif;
  border-radius: 5px;
  color: #383838;
  padding: 10px;
  `;
  const infoDivStyle = `
  display: block;
  background-color: #fff3c9;
  font-size: 15px;
  font-family: Helvetica, sans-serif;
  padding: 20px;
  border-radius: 10px;
  `;
  const adSlotDivStyle = `
  overflow-wrap: break-word;
  border: 1px solid;
  border-radius: 5px;
  padding: 5px;
  color: #383838;
  margin-bottom: 10px;
  `;
  const switchButtonStyle = `
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  `;
  const button = document.createElement("button");
  button.textContent = "SHOW";
  button.style = buttonStyle;
  document.body.appendChild(button);
  button.addEventListener("click", () => {
    if (modalIframe.style.display === 'none') {
      modalIframe.style.display = 'block';
    } else {
      modalIframe.style.display = 'none';
    }
  });

  const modalIframe = document.createElement('iframe');
  modalIframe.style = iframeStyle;
  modalIframe.id = '_PREBIDMODAL';
  modalIframe.style.display = 'none';  
  (document.body).appendChild(modalIframe);

  const contentDiv = document.createElement('div');
  contentDiv.style = divContentStyle;
  contentDiv.id = '_CONTENTDIV';

  const switchButton = document.createElement('button');
  switchButton.style = switchButtonStyle;
  switchButton.textContent = 'AdUnits';
  switchButton.addEventListener('click', () => {
    if (switchButton.textContent === 'AdUnits') {
      switchButton.textContent = 'Auctions';
      infoDiv.style.display = 'none';
      auctionDiv.style.display = 'block';
    } else {
      switchButton.textContent = 'AdUnits';
      infoDiv.style.display = 'block'
      auctionDiv.style.display = 'none';
    }
  });
  contentDiv.appendChild(switchButton);

  const headingDiv = document.createElement('div');
  headingDiv.style = headingDivStyle;
  headingDiv.id = '_HEADINGDIV';
  headingDiv.textContent = 'Loading......'
  contentDiv.appendChild(headingDiv);

  const infoDiv = document.createElement('div');
  infoDiv.style = infoDivStyle;
  infoDiv.id = '_INFODIV';
  contentDiv.appendChild(infoDiv);

  const auctionDiv = document.createElement('div');
  auctionDiv.style = infoDivStyle;
  auctionDiv.id = '_AUCTIONDIV';
  auctionDiv.style.display = 'none';
  contentDiv.appendChild(auctionDiv);
  modalIframe.contentDocument.body.appendChild(contentDiv);

  window._ISPBJSONPAGE = false;
  window._ISGPTONPAGE = false;
  const pbjsPromise = new Promise((res) => {
    const checkPbjs = setInterval(() => {
      if(window.pbjs && window.pbjs.adUnits) {
        window._ISPBJSONPAGE = true;
        res(window._ISPBJSONPAGE);
      }
    }, 50);
    window.addEventListener('load', () => {
      clearInterval(checkPbjs);
      res(window._ISPBJSONPAGE);
    });
  });

  const gptPromise = new Promise((res) => {
    const checkGpt = setInterval(() => {
      if(window.googletag && window.googletag.pubads) {
        window._ISGPTONPAGE = true;
        res(window._ISGPTONPAGE);
      }
    }, 50);
    window.addEventListener('load', () => {
      clearInterval(checkGpt);
      res(window._ISGPTONPAGE);
    });
  });

  

  Promise.all([gptPromise, pbjsPromise]).then(values => {
    if (values[0]) {
      headingDiv.textContent = '';
      headingDiv.textContent = 'GoogleTag is active on the page   |   '

      var winingBids = false;
      var prebidAdUnits = false;

      if (values[1]) {
        headingDiv.textContent += 'Prebid is active on the page';
        const prebid = window.pbjs;
        winingBids = prebid.getAllWinningBids();
        prebidAdUnits = prebid.adUnits;
        var bidResponses = [];
        prebid.onEvent('bidResponse', (res) => {
          bidResponses.push(res);
        });
        prebid.onEvent('auctionEnd', (res) => {
          const auctionSlotDiv = document.createElement('div');
          auctionSlotDiv.style = adSlotDivStyle;
          var data = `
          <h3 style="margin: 5px; color: #ff3b3b;">Auction: ${new Date(res.auctionEnd).toString()}</h3>
          <h4 style="margin: 5px; font-size: 1em; color: #2F3061">Auction Id: ${res.auctionId}</h4>
            ${res.adUnits.map(unit => {
              const matchedBids = bidResponses.filter(res => res.adUnitCode === unit.code);
              return (`
              <div style="border: 1px solid black; border-radius: 5px; padding: 5px;">
                <h5 style="margin: 5px; font-size: 1.3em;">
                  Ad unit: ${unit.code}
                </h5>
                <table style="width:100%">
                <tr>
                  <th style="text-align: left;">Bidder</th>
                  <th style="text-align: left;">Response</th>
                  <th style="text-align: left;">CPM</th>
                  <th style="text-align: left;">Size</th>
                  <th style="text-align: left;">Currency</th>
                </tr>
                  ${unit.bids.map(bid => {
                    const bidResponse = matchedBids.find(bidRes => bidRes.size === bid.params.size) || false;
                    return (`
                    <tr>
                      <td>${bid.bidder}</td>
                      <td>${bidResponse.timeToRespond ? bidResponse.timeToRespond : 'No bid '}</td>
                      <td>${bidResponse.cpm ? bidResponse.cpm : 'No bid '}</td>
                      <td>${bidResponse.size ? bidResponse.size : 'No bid'}</td>
                      <td>${bidResponse.currency ? bidResponse.currency : 'No bid'}</td>
                    </tr>
                  `)})}
                <table>
              </div>
            `)
            })}
          `;
          auctionSlotDiv.insertAdjacentHTML('afterbegin', data.replace(/,/gi, ''));
          auctionDiv.appendChild(auctionSlotDiv);
        });
      } else {
        headingDiv.textContent += 'Prebid is not active on the page';
      }

      var gtg = window.googletag;
      var adslots = gtg.pubads().getSlots();

      for (i = 0; i < adslots.length; i++ ) {
        const adUnitCode = adslots[i].getSlotId().getDomId();
        const prebidWon = winingBids ? winingBids.some(bid => bid.adUnitCode === adUnitCode) : false;
        const bidders = prebidAdUnits ? prebidAdUnits.find(adUnit => adUnit.code === adUnitCode) : false;
        const bids = bidders ? bidders.bids : false;
        const adSlotDiv = document.createElement('div');
        adSlotDiv.style = adSlotDivStyle;

        const data = `
        <h2>Ad unit path: ${adslots[i].getAdUnitPath()}</h2>
        <h4>Unit Size(s): ${adslots[i].getSizes().map(size => `["${size.width}x${size.height}"]`)}</h4>
        <h4>Ad unit code: ${adUnitCode}</h4>
        <h4>Prebid won: ${prebidWon ? 'Yes' : 'No'}</h4>
        <h5>
        ${bids ? 'Bidders: ' : ''}
        ${bids ? bids.map(bid => ' ' + bid.bidder) : ''}
        </h5>
        `;

        adSlotDiv.insertAdjacentHTML('afterbegin', data);
        infoDiv.appendChild(adSlotDiv);
      }
    } else {
      headingDiv.textContent = '';
      headingDiv.textContent = 'GoogleTag is not active on the page   |   Prebid is not active on the page'
    }
  });

  const requestDiv = document.createElement('div');
  requestDiv.style = adSlotDivStyle;
  requestDiv.id = '_REQUESTDIV';
  requestDiv.insertAdjacentHTML('afterbegin', `<h5>Requests: </h5>`);
  contentDiv.appendChild(requestDiv);
  
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    let [resource, config ] = args;
    const iframe = document.getElementById('_PREBIDMODAL');
    const requestDiv = iframe.contentDocument.body.children[0]
    .children._REQUESTDIV;
    var isSent = true;
    const res = await originalFetch('http://127.0.0.1:3000', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        "Access-Control-Allow-Origin": '*',
      },
      body: JSON.stringify(resource),
    })
    .catch(e => isSent = false)
    .finally(() => {
      const urlToShow = resource.length > 70 ? 
      resource.substring(0, 70) + "...       |       " 
      : resource + "       |       ";
      requestDiv.insertAdjacentHTML('beforeEnd', `<h5>${urlToShow}  ${isSent ? 'Sent to local server' : 'Failed to send to local server'}</h5>`);
    })
    const response = await originalFetch(resource, config);
    return response;
  };
}

const mainScriptTag = document.createElement('script');
mainScriptTag.textContent = scriptToText(mainScript);
document.querySelector('html').insertAdjacentElement('afterbegin', mainScriptTag);

function scriptToText(script) {
  var entire = script.toString();
  return entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
}