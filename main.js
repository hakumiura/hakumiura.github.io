let targetInput = null;
let state = {
  orderNumber: 1,
  orders: [],
  summary: { sugar: {}, kinako: {}, cocoa: {}, soup: {}, set: {} }
};

function setTargetInput(id) {
    targetInput = id;
}

function appendDigit(d) {
    if (targetInput) {
        const input = document.getElementById(targetInput);
        input.value = (input.value || '') + d;
    }
}

function clearCurrentInput() {
    if (targetInput) {
        document.getElementById(targetInput).value = '';
    }
}

function clearPeople() {
    document.getElementById('people').value = '';
}

function clearSelectedOrder() {
    if (targetInput && ['sugarCount','kinakoCount','cocoaCount','soupCount','setCount'].includes(targetInput)) {
        document.getElementById(targetInput).value = '';
    }
}

function calculateTotal() {
    const sugarPrice = +document.getElementById('sugarPrice').value || 0;
    const kinakoPrice = +document.getElementById('kinakoPrice').value || 0;
    const cocoaPrice = +document.getElementById('cocoaPrice').value || 0;
    const soupPrice = +document.getElementById('soupPrice').value || 0;
    const setPrice = +document.getElementById('setPrice').value || 0; 
    
    const sugar = (+document.getElementById('sugarCount').value || 0) * sugarPrice;
    const kinako = (+document.getElementById('kinakoCount').value || 0) * kinakoPrice;
    const cocoa = (+document.getElementById('cocoaCount').value || 0) * cocoaPrice;
    const soup = (+document.getElementById('soupCount').value || 0) * soupPrice;

    //const set = (+document.getElementById('setItemsContainer').children || 0) * setPrice;
    
    // ★ セットの合計金額を動的に計算するロジックに変更
    let totalSet = 0;
    const setRows = document.getElementById('setItemsContainer').children;
    
    Array.from(setRows).forEach(row => {
        const countInput = row.querySelector('input[type="text"]');
        const count = +(countInput.value || 0);
        totalSet += count * setPrice;
    });

    const total = sugar + kinako + cocoa + soup + totalSet;
    document.getElementById('total').textContent = total;
}

function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelector(`.tab[onclick*="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}


function markDone(button) {
    const tr = button.closest('tr');
    const rows = Array.from(tr.parentNode.children);
    const idx = rows.indexOf(tr);
    let numCell = tr.children[0].textContent;
    
    for (let i = idx; i < rows.length; i++) {
        if (rows[i].children[0].textContent === numCell || rows[i].children[0].textContent === '') {
          rows[i].classList.add('faded');
        } else {
          break;
        }
    }
}

// セットメニューの入力要素を動的に追加する関数
function addSetItem() {
    const container = document.getElementById('setItemsContainer');
    //const setPrice = document.getElementById('setPrice').value; 
    
    // 現在のセットアイテムの数に基づいてユニークなIDを作成
    const itemCount = container.children.length;
    const countId = `setCount_${itemCount}`;
    const breadId = `setBread_${itemCount}`;

    const newRow = document.createElement('tr');
    newRow.id = `setItemRow_${itemCount}`;
    newRow.innerHTML = `
        <td>セット ${itemCount + 1}</td>
        <td>
            <input type="text" id="${countId}" value="1" readonly onclick="setTargetInput('${countId}')" />
        </td>
        <td>
            <select id="${breadId}">
                <option value="シュガー">シュガー</option>
                <option value="きなこ">きなこ</option>
                <option value="ココア">ココア</option>
            </select>
            <button onclick="removeSetItem('${newRow.id}')" style="margin-left: 5px; background: #f99; border: none; padding: 2px 5px;">X</button>
        </td>
    `;
    // newRow.innerHTML の <td> 3つ目の内容は、単価フィールドを削除し、パン種類選択と削除ボタンに変更しています。
    // 単価は全て一律400円として処理します。
    
    container.appendChild(newRow);
    setTargetInput(countId); // 新しく追加した個数入力欄を選択状態にする
    //calculateTotal(); // 合計を再計算
}

// セットメニューの入力要素を削除する関数
function removeSetItem(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.remove();
        //calculateTotal(); // 合計を再計算

        // 削除後にターゲットが消えていたらクリア
        if (targetInput && targetInput.startsWith('setCount_') && !document.getElementById(targetInput)) {
            targetInput = null;
        }
    }
}

/*function sendToGoogleSheets(orderData) {
  const url = "https://script.google.com/macros/s/AKfycbzGcAUFOf_L2OS21vZaSagqI7kYLuuHFCT7JURCkYWXu0ELqucJkeaepVDfVBOr6rYm/exec";
  fetch(url, {
    method: "POST",
    mode: "no-cors", // 応答は見えないが保存される
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });
}*/