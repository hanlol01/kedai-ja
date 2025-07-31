// Simulasi penyimpanan sementara dengan state management yang lebih baik
let currentOrder = globalThis.kedaiOrders || [];
let paymentMethod = globalThis.paymentMethod || "";
let customerName = globalThis.customerName || "";
let deliveryType = globalThis.deliveryType || "";
let orderState = globalThis.orderState || "initial"; // ✅ Tambahan state management

const { action, item_name, quantity, price, notes, payment_method, customer_name, delivery_type } = JSON.parse($input);

function capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatCurrency(number) {
    return 'Rp' + number.toLocaleString('id-ID');
}

function calculateTotal(orderList) {
    return orderList.reduce((sum, item) => sum + item.subtotal, 0);
}

function buildOrderSummary(orderList) {
    if (orderList.length === 0) return "Belum ada pesanan.";
    
    let summary = "=== RINGKASAN PESANAN ===\n";
    orderList.forEach((item, index) => {
        summary += `${index + 1}. ${capitalize(item.name)} x${item.quantity} - ${formatCurrency(item.subtotal)}\n`;
        if (item.notes) summary += `   Catatan: ${item.notes}\n`;
    });
    summary += `\nTOTAL: ${formatCurrency(calculateTotal(orderList))}`;
    summary += "\n========================";
    return summary;
}

function getNextStep() {
    if (currentOrder.length === 0) return "initial";
    if (!paymentMethod) return "payment";
    if (!customerName) return "customer_name";
    if (!deliveryType) return "delivery_type";
    return "ready_to_confirm";
}

function resetOrder() {
    globalThis.kedaiOrders = [];
    globalThis.paymentMethod = "";
    globalThis.customerName = "";
    globalThis.deliveryType = "";
    globalThis.orderState = "initial";
    currentOrder = [];
    paymentMethod = "";
    customerName = "";
    deliveryType = "";
    orderState = "initial";
}

// Fungsi untuk mendeteksi input user dan menentukan action yang sesuai
function detectUserAction(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // Deteksi metode pembayaran
    if (input.includes('transfer') || input.includes('bank') || 
        input.includes('qris') || input.includes('online') || 
        input.includes('tempat') || input.includes('kasir') || input.includes('tunai')) {
        return 'set_payment';
    }
    
    // Deteksi nama (jika tidak ada kata kunci pembayaran/delivery)
    if (!input.includes('tempat') && !input.includes('bawa') && !input.includes('pulang') && 
        !input.includes('makan') && !input.includes('dine') && 
        !input.includes('transfer') && !input.includes('bank') && 
        !input.includes('qris') && !input.includes('online') && 
        !input.includes('kasir') && !input.includes('tunai') &&
        input.length >= 2) {
        return 'set_customer_name';
    }
    
    // Deteksi jenis pesanan
    if (input.includes('tempat') || input.includes('makan') || input.includes('dine') ||
        input.includes('bawa') || input.includes('pulang') || input.includes('take away')) {
        return 'set_delivery_type';
    }
    
    // Deteksi konfirmasi
    if (input.includes('konfirmasi') || input.includes('ya') || input.includes('oke') || input.includes('setuju')) {
        return 'confirm';
    }
    
    // Deteksi reset
    if (input.includes('reset') || input.includes('ulang') || input.includes('baru')) {
        return 'reset';
    }
    
    // Deteksi status
    if (input.includes('status') || input.includes('cek') || input.includes('lihat')) {
        return 'status';
    }
    
    // Default: add item
    return 'add';
}

// Main processing function
function processUserInput(userInput) {
    const detectedAction = detectUserAction(userInput);
    
    // Update action untuk diproses
    action = detectedAction;
    item_name = userInput;
    
    return processAction();
}

function processAction() {
    switch (action) {
        case 'add':
            if (!item_name) return "Mohon sebutkan nama item yang ingin dipesan.";
            
            const newItem = {
                id: Date.now(),
                name: item_name,
                quantity: quantity || 1,
                price: price || 0,
                notes: notes || '',
                subtotal: (quantity || 1) * (price || 0)
            };
            currentOrder.push(newItem);
            globalThis.kedaiOrders = currentOrder;
            
            // Set state ke payment jika ada pesanan
            orderState = "payment";
            globalThis.orderState = orderState;
            
            return `Item "${capitalize(item_name)}" x${newItem.quantity} berhasil ditambahkan ke pesanan.\n\n${buildOrderSummary(currentOrder)}\n\n📋 **Langkah selanjutnya:**\nSilakan pilih metode pembayaran:\n• Transfer Bank\n• Online Payment (QRIS)\n• Bayar di Tempat (Kasir)\n\nKetik metode pembayaran yang Anda inginkan.`;

        case 'update':
            if (!item_name) return "Item yang ingin diupdate tidak ditemukan.";
            const updateIndex = currentOrder.findIndex(item => item.name.toLowerCase() === item_name.toLowerCase());
            if (updateIndex !== -1) {
                if (quantity) currentOrder[updateIndex].quantity = quantity;
                if (price) currentOrder[updateIndex].price = price;
                if (notes) currentOrder[updateIndex].notes = notes;
                currentOrder[updateIndex].subtotal = currentOrder[updateIndex].quantity * currentOrder[updateIndex].price;
                globalThis.kedaiOrders = currentOrder;
                return `Pesanan untuk "${capitalize(item_name)}" berhasil diperbarui.\n\n${buildOrderSummary(currentOrder)}`;
            } else {
                return `Item "${item_name}" tidak ditemukan dalam pesanan.`;
            }

        case 'remove':
            if (!item_name) return "Item yang ingin dihapus tidak ditemukan.";
            const removeIndex = currentOrder.findIndex(item => item.name.toLowerCase() === item_name.toLowerCase());
            if (removeIndex !== -1) {
                const removed = currentOrder.splice(removeIndex, 1)[0];
                globalThis.kedaiOrders = currentOrder;
                
                // Reset state jika tidak ada pesanan lagi
                if (currentOrder.length === 0) {
                    resetOrder();
                    return `Item "${capitalize(removed.name)}" telah dihapus.\n\nBelum ada pesanan. Silakan tambahkan pesanan baru.`;
                }
                
                return `Item "${capitalize(removed.name)}" telah dihapus.\n\n${buildOrderSummary(currentOrder)}`;
            } else {
                return `Item "${item_name}" tidak ditemukan dalam pesanan.`;
            }

        case 'show':
            if (currentOrder.length === 0) return "Belum ada pesanan.";
            
            const nextStep = getNextStep();
            let response = `${buildOrderSummary(currentOrder)}\n\n`;
            
            switch (nextStep) {
                case "payment":
                    response += "📋 **Langkah selanjutnya:**\nSilakan pilih metode pembayaran:\n• Transfer Bank\n• Online Payment (QRIS)\n• Bayar di Tempat (Kasir)\n\nKetik metode pembayaran yang Anda inginkan.";
                    break;
                case "customer_name":
                    response += "📋 **Langkah selanjutnya:**\nMetode pembayaran sudah dicatat. Sekarang tolong berikan nama untuk pesanan ini.\n\nSiapa nama Anda?";
                    break;
                case "delivery_type":
                    response += "📋 **Langkah selanjutnya:**\nNama sudah dicatat. Sekarang pilih jenis pesanan:\n• Makan di tempat\n• Dibawa pulang (Take Away)\n\nPesanan untuk apa?";
                    break;
                case "ready_to_confirm":
                    response += "✅ **Semua informasi lengkap!**\nKetik 'konfirmasi' untuk melihat ringkasan lengkap dan melanjutkan ke pembayaran.";
                    break;
            }
            
            return response;

        case 'set_payment':
            if (!payment_method && !item_name) return "Mohon sebutkan metode pembayaran yang ingin digunakan.";
            
            const paymentInput = (payment_method || item_name || "").toLowerCase();
            let validPayment = "";
            
            if (paymentInput.includes('transfer') || paymentInput.includes('bank')) {
                validPayment = "transfer bank";
            } else if (paymentInput.includes('qris') || paymentInput.includes('online')) {
                validPayment = "online payment (qris)";
            } else if (paymentInput.includes('tempat') || paymentInput.includes('kasir') || paymentInput.includes('tunai')) {
                validPayment = "bayar di tempat (kasir)";
            } else {
                return "Mohon pilih metode pembayaran yang valid:\n• Transfer Bank\n• Online Payment (QRIS)\n• Bayar di Tempat (Kasir)";
            }
            
            globalThis.paymentMethod = validPayment;
            paymentMethod = validPayment;
            
            // Set state ke customer_name
            orderState = "customer_name";
            globalThis.orderState = orderState;
            
            return `✅ Metode pembayaran "${capitalize(validPayment)}" telah dicatat.\n\n📋 **Langkah selanjutnya:**\nSekarang tolong berikan nama untuk pesanan ini.\n\nSiapa nama Anda?`;

        case 'set_customer_name':
            if (!customer_name && !item_name) return "Mohon sebutkan nama untuk pesanan ini.";
            
            const nameInput = (customer_name || item_name || "").trim();
            if (nameInput.length < 2) return "Mohon berikan nama yang valid (minimal 2 karakter).";
            
            globalThis.customerName = nameInput;
            customerName = nameInput;
            
            // Set state ke delivery_type
            orderState = "delivery_type";
            globalThis.orderState = orderState;
            
            return `✅ Nama "${capitalize(nameInput)}" telah dicatat.\n\n📋 **Langkah selanjutnya:**\nSekarang pilih jenis pesanan:\n• Makan di tempat\n• Dibawa pulang (Take Away)\n\nPesanan untuk apa?`;

        case 'set_delivery_type':
            if (!delivery_type && !item_name) return "Mohon sebutkan apakah pesanan untuk makan di tempat atau dibawa pulang.";
            
            const deliveryInput = (delivery_type || item_name || "").toLowerCase();
            let validDelivery = "";
            
            if (deliveryInput.includes('tempat') || deliveryInput.includes('dine in') || deliveryInput.includes('makan')) {
                validDelivery = "makan di tempat";
            } else if (deliveryInput.includes('bawa') || deliveryInput.includes('take away') || deliveryInput.includes('pulang')) {
                validDelivery = "dibawa pulang (take away)";
            } else {
                return "Mohon pilih jenis pesanan yang valid:\n• Makan di tempat\n• Dibawa pulang (Take Away)";
            }
            
            globalThis.deliveryType = validDelivery;
            deliveryType = validDelivery;
            
            // Set state ke ready_to_confirm
            orderState = "ready_to_confirm";
            globalThis.orderState = orderState;
            
            return `✅ Jenis pesanan "${capitalize(validDelivery)}" telah dicatat.\n\n✅ **Semua informasi lengkap!**\nKetik 'konfirmasi' untuk melihat ringkasan lengkap dan melanjutkan ke pembayaran.`;

        case 'confirm':
            if (currentOrder.length === 0) return "Tidak ada pesanan untuk dikonfirmasi.";
            
            const nextStepCheck = getNextStep();
            if (nextStepCheck !== "ready_to_confirm") {
                return `❌ **Informasi belum lengkap!**\n\n${buildOrderSummary(currentOrder)}\n\n📋 **Langkah yang perlu dilengkapi:**\n${nextStepCheck === "payment" ? "• Pilih metode pembayaran" : ""}${nextStepCheck === "customer_name" ? "• Berikan nama pemesan" : ""}${nextStepCheck === "delivery_type" ? "• Pilih jenis pesanan (makan di tempat/dibawa pulang)" : ""}\n\nSilakan lengkapi informasi di atas terlebih dahulu.`;
            }

            let confirmation = `✅ **KONFIRMASI PESANAN LENGKAP**\n\nTerima kasih Kak ${capitalize(customerName)}! Berikut ringkasan pesanan Anda:\n\n`;

            currentOrder.forEach((item, index) => {
                confirmation += `${index + 1}. ${capitalize(item.name)} x${item.quantity} = ${formatCurrency(item.subtotal)}\n`;
                if (item.notes) confirmation += `   Catatan: ${item.notes}\n`;
            });

            confirmation += `\nTotal semua pesanan : ${formatCurrency(calculateTotal(currentOrder))}`;
            confirmation += `\nMetode Pembayaran : ${capitalize(paymentMethod)}`;
            confirmation += `\nAtas Nama : ${capitalize(customerName)}`;
            confirmation += `\nTipe Layanan : ${capitalize(deliveryType)}`;
            confirmation += `\n\nSilakan klik tombol "Konfirmasi Pesanan ke Admin" di bawah ini untuk menyelesaikan pesanan dan melakukan pembayaran.`;

            // Reset semua data setelah konfirmasi
            resetOrder();

            return confirmation;

        case 'reset':
            resetOrder();
            return "✅ Pesanan telah direset. Silakan mulai pesanan baru.";

        case 'status':
            return `📊 **Status Pesanan:**\n• Jumlah item: ${currentOrder.length}\n• Metode pembayaran: ${paymentMethod || "Belum dipilih"}\n• Nama pemesan: ${customerName || "Belum diisi"}\n• Jenis pesanan: ${deliveryType || "Belum dipilih"}\n• Status: ${orderState}\n\n${buildOrderSummary(currentOrder)}`;

        default:
            return "Aksi tidak dikenali. Gunakan: add, update, remove, show, set_payment, set_customer_name, set_delivery_type, confirm, reset, atau status.";
    }
}

// Main execution
return processUserInput($input); 