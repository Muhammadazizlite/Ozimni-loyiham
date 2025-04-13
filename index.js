// index.js
let data;

async function loadData() {
    try {
        const response = await fetch('database.json');
        if (!response.ok) throw new Error('Server error');
        const jsonData = await response.json();
        data = jsonData[0];
        createCategoryButtons();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load data');
    }
}

function createCategoryButtons() {
    const btnContainer = document.getElementById('btns-div');
    btnContainer.innerHTML = '';
    
    data.products.forEach(category => {
        const categoryName = Object.keys(category)[0];
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = categoryName;
        button.addEventListener('click', () => showProducts(categoryName));
        btnContainer.appendChild(button);
    });
}

function showProducts(categoryName) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    const category = data.products.find(c => c[categoryName]);
    if (!category) return;

    category[categoryName].forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3 class="product-name-large">${product.name}</h3>
            ${product.base ? `<div class="product-base">Bazada: ${product.base} ta</div>` : ''}
            ${product.between ? `<div class="product-between">Oraliq: ${product.between} sm</div>` : ''}
            ${product.addthing ? `<div class="product-addthing">${product.addthing}</div>` : ''}
        `;
        
        card.addEventListener('click', () => showProductDetails(product, categoryName));
        container.appendChild(card);
    });
}

function showProductDetails(product, categoryName) {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div id="active-product">
            <div id="header-prod">
                <div id="name-side-prod">
                    <div id="name-prod">
                        <h1>${product.name}</h1>
                    </div>
                </div>
                <div id="setting-side-prod">
                    <div id="settings-prod">
                        <button type="button" onclick="changeProdSettings('${product.name}')">Standartlarni o'zgartirish</button>
                        <button type="button" onclick="changeProdBase('${product.name}')">Bazani o'zgartirish</button>
                    </div>
                </div>
            </div>
            <div id="prod-info">
                <div id="about-prod">${product.addthing}</div>
                <div id="sell-prod">
                    <div class="input-group">
                        <label for="sellInputSoni">Soni:</label>
                        <input type="number" id="sellInputSoni" placeholder="Sotilgan miqdor">
                    </div>
                    <div class="input-group">
                        <label for="sellInputNarx">Narxi:</label>
                        <input type="number" id="sellInputNarx" value="${parseInt(product.price.replace(/\D/g, ''))}">
                    </div>
                    <div class="input-group">
                        <label for="tolov">To'lov usuli:</label>
                        <select id="tolov">
                            <option value="naqt">Naqt</option>
                            <option value="qarz">Qarz</option>
                            <option value="karta">Karta</option>
                        </select>
                    </div>
                    <button type="button" onclick="sellProduct('${categoryName}', '${product.name}')">Sotishni tasdiqlash</button>
                </div>
            </div>
        </div>
    `;
}

function sellProduct(categoryName, productName) {
    const count = parseInt(document.getElementById('sellInputSoni').value);
    const price = parseInt(document.getElementById('sellInputNarx').value);
    const paymentMethod = document.getElementById('tolov').value;

    // Update product base
    const product = data.products
        .find(c => c[categoryName])[categoryName]
        .find(p => p.name === productName);
    
    product.base -= count;

    // Add to sales
    data.sotuvTizimi[0].stoyka.push({
        name: productName,
        selledSoni: count,
        selltype: product.selltype,
        selledNarx: price,
        selledTime: new Date().toISOString().split('T')[0],
        isQarz: paymentMethod === 'qarz',
        ispaid: paymentMethod === 'naqt'
    });

    // Show updated products
    showProducts(categoryName);
    alert("Sotuv muvaffaqiyatli qayd etildi!");
}

window.onload = loadData;