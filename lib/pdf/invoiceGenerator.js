import jsPDF from 'jspdf'
import 'jspdf-autotable'

export function generateInvoice(order, storeInfo) {
    const doc = new jsPDF()
    const currency = '₹'

    // Header - Company Branding
    doc.setFillColor(34, 139, 34) // Green
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('Flour2Door', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Fresh Flour, Delivered to Your Door', 105, 30, { align: 'center' })

    // Reset text color
    doc.setTextColor(0, 0, 0)

    // Invoice Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('TAX INVOICE', 105, 55, { align: 'center' })

    // Invoice Info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice No: ${order.orderNumber}`, 20, 70)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 20, 76)
    doc.text(`Payment: ${order.isPaid ? 'PAID' : 'COD'}`, 20, 82)

    // Store & Customer Details Side by Side
    // Store Details (Left)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('From:', 20, 95)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(storeInfo.name, 20, 102)
    doc.text(storeInfo.address.substring(0, 40), 20, 108)
    if (storeInfo.address.length > 40) {
        doc.text(storeInfo.address.substring(40, 80), 20, 114)
    }
    doc.text(`Email: ${storeInfo.email}`, 20, 120)
    doc.text(`Phone: ${storeInfo.contact}`, 20, 126)

    // Customer Details (Right)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Bill To:', 120, 95)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(order.address.name, 120, 102)
    doc.text(order.address.street, 120, 108)
    doc.text(`${order.address.city}, ${order.address.state}`, 120, 114)
    doc.text(`${order.address.zip}`, 120, 120)
    doc.text(`Phone: ${order.address.phone}`, 120, 126)

    // Items Table
    const tableData = order.orderItems.map(item => [
        item.product.name,
        item.quantity.toString(),
        `${currency}${item.price.toFixed(2)}`,
        `${currency}${(item.price * item.quantity).toFixed(2)}`
    ])

    doc.autoTable({
        startY: 140,
        head: [['Item', 'Qty', 'Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [34, 139, 34],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        columnStyles: {
            0: { cellWidth: 90 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' }
        }
    })

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10
    
    const subtotal = order.orderItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
    )

    doc.setFontSize(10)
    doc.text('Subtotal:', 140, finalY)
    doc.text(`${currency}${subtotal.toFixed(2)}`, 190, finalY, { align: 'right' })

    if (order.isCouponUsed && order.coupon) {
        const discount = (subtotal * order.coupon.discount) / 100
        doc.text(`Discount (${order.coupon.discount}%):`, 140, finalY + 6)
        doc.text(`-${currency}${discount.toFixed(2)}`, 190, finalY + 6, { align: 'right' })
    }

    // Grand Total
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    const grandTotalY = order.isCouponUsed ? finalY + 12 : finalY + 6
    doc.text('Grand Total:', 140, grandTotalY)
    doc.text(`${currency}${order.total.toFixed(2)}`, 190, grandTotalY, { align: 'right' })

    // Footer
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    const footerY = 270
    doc.text('Thank you for shopping with Flour2Door!', 105, footerY, { align: 'center' })
    doc.text('For queries: contact@flour2door.com | +91 8149090936', 105, footerY + 5, { align: 'center' })

    return doc
}

export function downloadInvoice(order, storeInfo) {
    const doc = generateInvoice(order, storeInfo)
    doc.save(`Invoice-${order.orderNumber}.pdf`)
}

export function printInvoice(order, storeInfo) {
    const doc = generateInvoice(order, storeInfo)
    doc.autoPrint()
    window.open(doc.output('bloburl'), '_blank')
}