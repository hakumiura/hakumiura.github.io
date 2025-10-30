window.onload = function () {
  // localStorageに保存されている 'orders' は、[{ orderNumber: 1, data: { ... }, total: ... }, ...] の形式
  const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
  const savedOrderNumber = +localStorage.getItem('orderNumber') || 1; // 最終の注文番号を復元
  const savedSummary = JSON.parse(localStorage.getItem('summary')) || {totalPeople: 0}; // summaryの復元

  // 初期化
  state.orders = [];
  state.orderNumber = savedOrderNumber; // ★ 最終注文番号をセット
  state.summary = savedSummary; // ★ summaryを復元
  
  // totalPeople の初期表示を更新
  document.getElementById('totalPeople').textContent = state.summary.totalPeople;


  savedOrders.forEach(orderEntry => { // orderEntryは { orderNumber, data, total } のオブジェクト
    const orderNumber = orderEntry.orderNumber; // 注文番号
    const orderData = orderEntry.data; // { sugar: { price: qty }, kinako: ..., set: { price: { qty, bread } } }

    state.orders.push(orderData); // state.orders には orderData のみが格納される

    // 履歴表示
    const table = document.getElementById('historyTable');

    // 単品注文のアイテムリストを動的に作成
    const items = [
      // orderDataから、商品名と個数を取得するロジックに変更
      { name: 'シュガー', data: orderData.sugar },
      { name: 'きなこ', data: orderData.kinako },
      { name: 'ココア', data: orderData.cocoa },
      { name: 'コンソメスープ', data: orderData.soup }
    ];

    let first = true;
    items.forEach(item => {
      // item.data は { price: qty } のマップ。単純に個数(qty)を合算
      const totalQty = Object.values(item.data).reduce((sum, qty) => sum + qty, 0);

      if (totalQty > 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${first ? orderNumber : ''}</td>
          <td>${item.name}</td>
          <td>${totalQty}</td>
          <td>${first ? '<button onclick="markDone(this)">OK</button>' : ''}</td>`;
        table.appendChild(row);
        first = false;
      }
    });

    // セットメニューの履歴表示
    /*if (orderData.set && Object.keys(orderData.set).length > 0) {
      // orderData.set は { price: { qty, bread } }
      
      // セット注文は価格に関わらず、パンの種類ごとにまとめて表示
      const setTotalQty = Object.values(orderData.set).reduce((sum, setInfo) => sum + setInfo.qty, 0);
      const setBreadType = Object.values(orderData.set)[0].bread; // ★簡易的に最初のセットのパンの種類を取得

      if (setTotalQty > 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${first ? orderNumber : ''}</td>
          <td>セット（${setBreadType}：スープ）</td>
          <td>${setTotalQty}</td>
          <td>${first ? '<button onclick="markDone(this)">OK</button>' : ''}</td>`;
        table.appendChild(row);
      }
    }*/
    // セットメニューの履歴表示
    if (orderData.set && Object.keys(orderData.set).length > 0) {
        // orderData.set の全要素に対して履歴表示を行う
        Object.values(orderData.set).forEach(setEntry => {
            if (setEntry.qty > 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                  <td>${first ? orderNumber : ''}</td>
                  <td>セット（${setEntry.bread}：スープ）</td>
                  <td>${setEntry.qty}</td>
                  <td>${first ? '<button onclick="markDone(this)">OK</button>' : ''}</td>`;
                table.appendChild(row);
                first = false; 
            }
        });
    }
  });

  // 集計再描画
  renderSummaryFromOrders(state.orders);
};


// clearHistory関数は、まとめで修正
function clearHistory() {
  if (confirm("本当に履歴を削除しますか？")) {
    localStorage.removeItem('orders');
    localStorage.removeItem('orderNumber');
    localStorage.removeItem('summary'); 
    location.reload(); 
    
  }
}