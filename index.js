let data; // Global o'zgaruvchi

// Ma'lumotlarni yuklash
async function loadData() {
    fetch('database.json')
        .then(response => {
            if (!response.ok) throw new Error('Server xatosi');
            return response.json();
        })
        .then(jsonData => {
            data = jsonData[0];
            createCategoryButtons(); // Ma'lumotlar yuklangandan keyin chaqiramiz
        })
        .catch(error => {
            console.error('Xatolik:', error);
            alert('Ma\'lumotlarni yuklab boʻlmadi');
        });
}

// Kategoriya tugmalarini yaratish
function createCategoryButtons() {
      

    const btnContainer = document.getElementById('btns-div');
    btnContainer.innerHTML = ''; // Oldingi tugmalarni tozalash

    data.products.forEach(category => {
        const categoryName = Object.keys(category)[0];
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = categoryName;
        button.addEventListener('click', () => showProducts(categoryName));
        btnContainer.appendChild(button);
    });
}

// Dasturni ishga tushirish
window.onload = loadData;

  // Mahsulotlarni ko'rsatish
  function showProducts(categoryName) {
      const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    const category = data.products.find(c => c[categoryName]);
    if (!category) return;

    category[categoryName].forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let html = `
            <h3 class="product-name-large">${product.name}</h3>
        `; // Narx qatori o'chirildi

        // Bazada qolgan miqdor
        if (product.base !== undefined && product.base !== null) {
            html += `<div class="product-base">Bazada: ${product.base} ta</div>`;
        }
  
          // Katta ko'rinadigan between (latok va kalodus uchun)
          if (product.between) {
              html += `<div class="product-between">Oraliq: ${product.between} sm</div>`;
          }
  
          // Qolgan maydonlar
          const details = {
              'lenght': `Uzunlik: ${product.lenght}`,
              'used': `Ishlatilishi: ${product.used}`,
              'color': `Rangi: ${product.color}`
          };
  
          for (const [key, text] of Object.entries(details)) {
              if (product[key]) {
                  html += `<div class="product-detail-small">${text}</div>`;
              }
          }
  
          if (product.addthing) {
              html += `<div class="product-addthing">${product.addthing}</div>`;
          }
  
          card.innerHTML = html;
          container.appendChild(card);
      });
  }

  // Dasturni ishga tushirish