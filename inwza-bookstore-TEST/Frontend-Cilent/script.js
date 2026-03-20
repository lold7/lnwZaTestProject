/* ==========================================
   ไฟล์: script.js 
   รวบรวมฟังก์ชัน JavaScript สำหรับการทำงานฝั่ง Frontend มี cart ที่เขียนในไฟล์เดียว
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================================================
    // ส่วนที่ 1: ระบบ Pagination (การแบ่งหน้าสินค้า) รอ Data ทำไว้ก่อน
    // ใช้ร่วมกับไฟล์: all-products.html (เท่านั้น)
    // ========================================================================
    
    // ดึง Element จากหน้า HTML มาเก็บไว้ในตัวแปร
    const productList = document.getElementById('product-list'); // พื้นที่สำหรับแสดงรายชื่อหนังสือ
    const paginationControls = document.getElementById('pagination-controls'); // พื้นที่สำหรับแสดงปุ่มเปลี่ยนหน้า

    // เช็กว่าหน้าเว็บปัจจุบันมี Element ทั้ง 2 ตัวนี้หรือไม่ (เพื่อป้องกัน Error เวลาโหลดสคริปต์นี้ในหน้าอื่นๆ)
    if (productList && paginationControls) {

        // 1.1 จำลองข้อมูลสินค้า (Mock Data) จำนวน 22 ชิ้น
        const products = [];
        for (let i = 1; i <= 22; i++) {
            products.push({
                id: i,
                title: `Awesome Book Title ${i}`,
                author: "Famous Author",
                price: Math.floor(Math.random() * 20) + 10, // สุ่มราคาตั้งแต่ 10 ถึง 29
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"
            });
        }

        const itemsPerPage = 15; // กำหนดจำนวนสินค้าที่จะแสดงต่อ 1 หน้า (ตาม Requirement คือ 15 ชิ้น)
        let currentPage = 1; // ตัวแปรเก็บค่าหน้าที่กำลังเปิดอยู่ปัจจุบัน

        // 1.2 ฟังก์ชันสำหรับแสดงผลหนังสือตามหน้าที่เลือก
        function displayProducts(page) {
            productList.innerHTML = ""; // เคลียร์ข้อมูลเก่าออกก่อน
            
            // คำนวณหา Index ของสินค้าที่จะแสดงในหน้านั้นๆ
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedItems = products.slice(startIndex, endIndex); // ตัดข้อมูลมาเฉพาะส่วนที่ต้องการแสดง

            // วนลูปสร้าง HTML Card สำหรับหนังสือแต่ละเล่ม
            paginatedItems.forEach(product => {
                const productHTML = `
                    <div class="col-lg-4 col-md-4 col-sm-6 col-6 mb-4 d-flex justify-content-center">
                        <div class="card border-0 h-100 w-100" style="cursor: pointer;">
                            <img src="${product.image}" class="card-img-top rounded-4" alt="${product.title}" style="height: 280px; object-fit: cover;">
                            <div class="card-body text-center px-1 px-sm-2">
                                <h6 class="card-title fw-bold mb-1 small-on-mobile">${product.title}</h6>
                                <p class="text-muted small mb-2">${product.author}</p>
                                <p class="fw-bold mb-0">$${product.price}.00</p>
                            </div>
                        </div>
                    </div>
                `;
                // นำ HTML ที่สร้างเสร็จไปแทรกในหน้าเว็บ
                productList.insertAdjacentHTML('beforeend', productHTML);
            });
        }

        // 1.3 ฟังก์ชันสำหรับสร้างปุ่มกดเปลี่ยนหน้า (Pagination Buttons)
        function setupPagination() {
            paginationControls.innerHTML = ""; // เคลียร์ปุ่มเก่าออกก่อน
            const pageCount = Math.ceil(products.length / itemsPerPage); // คำนวณจำนวนหน้าทั้งหมด

            // สร้างปุ่ม "Prev" (ย้อนกลับ)
            const prevLi = document.createElement('li');
            prevLi.classList.add('page-item');
            if (currentPage === 1) prevLi.classList.add('disabled'); // ถ้าอยู่หน้าแรก ให้ปุ่มกดไม่ได้
            const prevA = document.createElement('a');
            prevA.classList.add('page-link', 'rounded-pill', 'mx-1');
            prevA.href = "#";
            prevA.innerText = "Prev";
            // สร้าง Event เมื่อกดปุ่ม Prev
            prevA.addEventListener('click', function (e) {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--; // ลดค่าหน้าปัจจุบันลง 1
                    displayProducts(currentPage); // รีเฟรชสินค้า
                    setupPagination(); // รีเฟรชสถานะปุ่ม
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนจอกลับขึ้นด้านบน
                }
            });
            prevLi.appendChild(prevA);
            paginationControls.appendChild(prevLi);

            // สร้างปุ่มตัวเลขหน้า (1, 2, 3, ...)
            for (let i = 1; i <= pageCount; i++) {
                const li = document.createElement('li');
                li.classList.add('page-item');
                if (i === currentPage) li.classList.add('active'); // ไฮไลต์สีหน้าที่กำลังเปิดอยู่
                
                const a = document.createElement('a');
                a.classList.add('page-link', 'rounded-circle', 'mx-1');
                a.href = "#";
                a.innerText = i;
                
                // สร้าง Event เมื่อกดปุ่มตัวเลขหน้า
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    currentPage = i; // เปลี่ยนหน้าปัจจุบันเป็นหน้าที่กด
                    displayProducts(currentPage);
                    setupPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                li.appendChild(a);
                paginationControls.appendChild(li);
            }

            // สร้างปุ่ม "Next" (ถัดไป)
            const nextLi = document.createElement('li');
            nextLi.classList.add('page-item');
            if (currentPage === pageCount) nextLi.classList.add('disabled'); // ถ้าอยู่หน้าสุดท้าย ให้ปุ่มกดไม่ได้
            const nextA = document.createElement('a');
            nextA.classList.add('page-link', 'rounded-pill', 'mx-1');
            nextA.href = "#";
            nextA.innerText = "Next";
            // สร้าง Event เมื่อกดปุ่ม Next
            nextA.addEventListener('click', function (e) {
                e.preventDefault();
                if (currentPage < pageCount) {
                    currentPage++; // เพิ่มค่าหน้าปัจจุบันขึ้น 1
                    displayProducts(currentPage); // รีเฟรชสินค้า
                    setupPagination(); // รีเฟรชสถานะปุ่ม
                    window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนจอกลับขึ้นด้านบน
                }
            });
            nextLi.appendChild(nextA);
            paginationControls.appendChild(nextLi);
        }

        // 1.4 เรียกใช้งานฟังก์ชันครั้งแรกเมื่อหน้าเว็บโหลดเสร็จ
        displayProducts(currentPage);
        setupPagination();
    }


    // ========================================================================
    // ส่วนที่ 2: ระบบค้นหาสินค้า (Search Bar) เเต่ยังไม่มีฐานข้อมูลนะ
    // ใช้ร่วมกับไฟล์: ทุกหน้าที่มีแถบ Navbar (index, categories, all-products, cart, contact ฯลฯ)
    // ========================================================================
    
    const searchForms = document.querySelectorAll('form'); // ค้นหาฟอร์มทั้งหมดในหน้าเว็บปัจจุบัน

    // วนลูปเช็กทุกฟอร์มที่หาเจอ
    searchForms.forEach(form => {
        const searchInput = form.querySelector('input[type="search"]'); // หาเฉพาะช่อง input ที่ใช้สำหรับค้นหา
        
        // ถ้าเจอกล่องค้นหา ให้ผูก Event รอรับการกด Enter
        if (searchInput) {
            form.addEventListener('submit', function (e) {
                e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชแบบดั้งเดิม
                
                const query = searchInput.value.trim(); // ดึงข้อความที่ผู้ใช้พิมพ์ (และตัดช่องว่างซ้ายขวาออก)
                
                // ถ้ามีการพิมพ์คำค้นหาเข้ามาจริง
                if (query) {
                    // ให้เปลี่ยนหน้าเว็บไปยัง search-results.html และแนบคำค้นหา (query) ไปกับ URL
                    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
                }
            });
        }
    });

});
