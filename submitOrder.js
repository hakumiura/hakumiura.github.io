// オーダー履歴
// history.js の submitOrder 関数を修正

function submitOrder() {
    const sugarQty = +document.getElementById('sugarCount').value || 0;
    const kinakoQty = +document.getElementById('kinakoCount').value || 0;
    const cocoaQty = +document.getElementById('cocoaCount').value || 0;
    const soupQty = +document.getElementById('soupCount').value || 0;
    //const setQty = +document.getElementById('setCount').value || 0; // 削除
    
    const sugarPrice = +document.getElementById('sugarPrice').value || 0;
    const kinakoPrice = +document.getElementById('kinakoPrice').value || 0;
    const cocoaPrice = +document.getElementById('cocoaPrice').value || 0;
    const soupPrice = +document.getElementById('soupPrice').value || 0;
    const setPrice = +document.getElementById('setPrice').value || 0;
    //const setBread = document.getElementById('setBread').value; // 削除
    
    const people = +document.getElementById('people').value || 0;
    const total = +document.getElementById('total').textContent || 0;  
      
    const table = document.getElementById('historyTable');

    // 注文データ構築
    let orderData = {
      sugar: {}, kinako: {}, cocoa: {}, soup: {}, set: {}, people: people 
    };

    if (sugarQty > 0) orderData.sugar[sugarPrice] = sugarQty;
    if (kinakoQty > 0) orderData.kinako[kinakoPrice] = kinakoQty;
    if (cocoaQty > 0) orderData.cocoa[cocoaPrice] = cocoaQty;
    if (soupQty > 0) orderData.soup[soupPrice] = soupQty;
    
    // ★ 動的に追加されたセットアイテムの処理
    const setRows = document.getElementById('setItemsContainer').children;
    let totalSetQty = 0;
    
    Array.from(setRows).forEach(row => {
        const countInput = row.querySelector('input[type="text"]');
        const breadSelect = row.querySelector('select');
        const qty = +(countInput.value || 0);
        const bread = breadSelect.value;
        
        if (qty > 0) {
            // セットはパンの種類ごとに集計・保存する構造を維持
            // ※ priceは一律 setPrice (400)
            //if (!orderData.set[setPrice]) {
              //  orderData.set[setPrice] = { qty: 0, bread: bread };
            //}
            
            const uniqueKey = `set-${Array.from(setRows).indexOf(row)}`;
            orderData.set[uniqueKey] = { qty: qty, bread: bread, price: setPrice };
            totalSetQty += qty;
        }
    });

    /*if (setQty > 0) {
        orderData.set[setPrice] = { // キーは価格 (例: 400)
            qty: setQty,          // 値は注文個数 (例: 1)
            bread: setBread       // パンの種類 (例: "シュガー")
        };
    }*/

    // 表示：履歴に追加 (単品は変更なし)
    const items = [
        { name: 'シュガー', qty: sugarQty },
        { name: 'きなこ', qty: kinakoQty },
        { name: 'ココア', qty: cocoaQty }, 
        { name: 'コンソメスープ', qty: soupQty }, 
    ];

    let first = true;
    items.forEach(item => {
        if (item.qty > 0) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${first ? state.orderNumber : ''}</td>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${first ? '<button onclick="markDone(this)">OK</button>' : ''}</td>`;
          table.appendChild(row);
          first = false;
        }
    });

    // セットメニューがある場合、別途追加
    // orderData.set の全要素に対して履歴表示を行う
    Object.values(orderData.set).forEach(setEntry => {
        if (setEntry.qty > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${first ? state.orderNumber : ''}</td>
              <td>セット（${setEntry.bread}：スープ）</td>
              <td>${setEntry.qty}</td>
              <td>${first ? '<button onclick="markDone(this)">OK</button>' : ''}</td>`;
            table.appendChild(row);
            first = false; // 各セットアイテムの後に first を false にする
        }
    });

    // 状態保存
    if (!state.orders) state.orders = [];
    state.orders.push(orderData); 

    state.summary.totalPeople += people;

  // localStorage に保存
  const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
  allOrders.push({
      orderNumber: state.orderNumber,
      data: orderData,   
      total: total       
    });
    
  localStorage.setItem('orders', JSON.stringify(allOrders));
  localStorage.setItem('summary', JSON.stringify(state.summary));
  localStorage.setItem('orderNumber', state.orderNumber + 1); // 次に使う番号を保存

  state.orderNumber++;
    // 集計更新

    renderSummaryFromOrders(state.orders);
    

    // 入力リセット
    ['sugarCount','kinakoCount','cocoaCount','soupCount'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('setItemsContainer').innerHTML = ''; // ★ 動的に追加されたセットアイテムを削除
    document.getElementById('total').textContent = '0';
    
    //sendToGoogleSheets(orderData);
}