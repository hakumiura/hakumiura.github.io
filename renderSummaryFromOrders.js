function renderSummaryFromOrders(orders) {
  const container = document.getElementById('summaryTables');
  container.innerHTML = ''; // 表全体を

  // ▼ 単品とセットを分けて定義
  const singleItems = ['sugar', 'kinako', 'cocoa', 'soup'];
  const displayNames = {
    sugar: 'シュガー',
    kinako: 'きなこ',
    cocoa: 'ココア',
    soup: 'コンソメスープ'
  };

  // 単品テーブル作成
  const singleWrapper = document.createElement('div');
  singleWrapper.className = 'summary-wrapper';

  const singleTitle = document.createElement('h3');
  singleTitle.textContent = '【単品】';
  singleWrapper.appendChild(singleTitle);

  const singleTable = document.createElement('table');
  singleTable.className = 'total-table';
  singleTable.innerHTML = '<tr><th>種類</th><th>総個数</th><th>単価</th><th>個数</th><th>価格</th></tr>';

  let totalItems = 0;
  let totalPrice = 0;

  singleItems.forEach(item => {
    const unitMap = {};
    orders.forEach(order => {
      if (order[item]) {
        for (const unitPrice in order[item]) {
          const qty = order[item][unitPrice];
          if (!unitMap[unitPrice]) unitMap[unitPrice] = 0;
          unitMap[unitPrice] += qty;
        }
      }
    });

    const unitPrices = Object.keys(unitMap).sort((a, b) => +a - +b);
    const totalQty = unitPrices.reduce((sum, price) => sum + unitMap[price], 0);
    const totalItemPrice = unitPrices.reduce((sum, price) => sum + unitMap[price] * price, 0);
    totalItems += totalQty;
    totalPrice += totalItemPrice;

    let first = true;
    unitPrices.forEach(unitPrice => {
      const qty = unitMap[unitPrice];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${first ? displayNames[item] : ''}</td>
        <td>${first ? totalQty : ''}</td>
        <td>${unitPrice}</td>
        <td>${qty}</td>
        <td>${qty * unitPrice}</td>`;
      singleTable.appendChild(row);
      first = false;
    });
  });

  const footer = document.createElement('tr');
  footer.innerHTML = `<td>合計</td><td>${totalItems}</td><td colspan="2"></td><td>${totalPrice}</td>`;
  singleTable.appendChild(footer);
  singleWrapper.appendChild(singleTable);
  container.appendChild(singleWrapper);

  // ▼ セットメニューの集計
  const setWrapper = document.createElement('div');
  setWrapper.className = 'summary-wrapper';

  const setTitle = document.createElement('h3');
  setTitle.textContent = '【セット】';
  setWrapper.appendChild(setTitle);

  const setTable = document.createElement('table');
  setTable.className = 'total-table';
  setTable.innerHTML = '<tr><th>パンの種類</th><th>総個数</th><th>単価</th><th>個数</th><th>価格</th></tr>';

  /*const setMap = {}; // { bread: { price: qty } }

  orders.forEach(order => {
    if (order.set) {
      for (const price in order.set) {
        const { qty, bread } = order.set[price];
        if (!setMap[bread]) setMap[bread] = {};
        if (!setMap[bread][price]) setMap[bread][price] = 0;
        setMap[bread][price] += qty;
      }
    }
  });*/
  
  /*const setMap = {}; // { bread: { price: qty } }

  orders.forEach(order => {
    if (order.set) {
      // order.set は { uniqueKey: { qty, bread, price } }
      Object.values(order.set).forEach(setEntry => {
        const { qty, bread, price } = setEntry; // price も取得
        
        if (!setMap[bread]) setMap[bread] = {};
        if (!setMap[bread][price]) setMap[bread][price] = 0;
        setMap[bread][price] += qty;
      });
    }
  });*/

  // --- セット注文の集計 ---
const setMap = {};
orders.forEach(order => {
  if (order.set) {
    Object.values(order.set).forEach(({ qty, bread, price }) => {
      if (!setMap[bread]) setMap[bread] = {};
      if (!setMap[bread][price]) setMap[bread][price] = 0;
      setMap[bread][price] += qty;
    });
  }
});


  let setTotalQty = 0;
  let setTotalPrice = 0;

  for (const bread in setMap) {

    const priceMap = setMap[bread];
    const unitPrices = Object.keys(priceMap).sort((a, b) => +a - +b);
    const totalQty = unitPrices.reduce((sum, price) => sum + priceMap[price], 0);
    const total = unitPrices.reduce((sum, price) => sum + priceMap[price] * price, 0);
    setTotalQty += totalQty;
    setTotalPrice += total;

    let first = true;
    unitPrices.forEach(price => {
      const qty = priceMap[price];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${first ? bread : ''}</td>
        <td>${first ? totalQty : ''}</td>
        <td>${price}</td>
        <td>${qty}</td>
        <td>${qty * price}</td>`;
      setTable.appendChild(row);
      first = false;
    });
  }

  const setFooter = document.createElement('tr');
  setFooter.innerHTML = `<td>合計</td><td>${setTotalQty}</td><td colspan="2"></td><td>${setTotalPrice}</td>`;
  setTable.appendChild(setFooter);
  setWrapper.appendChild(setTable);
  container.appendChild(setWrapper);

  // 合計人数表示
  document.getElementById('totalPeople').textContent = state.summary.totalPeople;
}