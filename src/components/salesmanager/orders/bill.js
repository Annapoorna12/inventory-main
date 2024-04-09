import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

function getCurrentDate() {
    const currentDate = new Date();

    // Get year, month, and day
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Concatenate to form YYYY-MM-DD format
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const GST_RATE = 0.18; // Assuming GST rate is 18%

// Function to calculate total amount including GST
const calculateTotalWithGST = (subtotal) => {
  const gstAmount = parseInt(subtotal) * GST_RATE;
  const totalWithGST = parseInt(subtotal) + gstAmount;
  return totalWithGST;
};



export const generateInvoicePDF = (orderData) => {
  
  const doc = new jsPDF();

  autoTable(doc, {
    body: [
      [
        {
          content: 'INVENTORY STORE MANAGMENT SYSTEM',
          styles: {
            halign: 'left',
            fontSize: 20,
            textColor: '#ffffff'
          }
        },
        {
          content: 'BILL',
          styles: {
            halign: 'right',
            fontSize: 20,
            textColor: '#ffffff'
          }
        }
      ],
    ],
    theme: 'plain',
    styles: {
      fillColor: '#3366ff'
    }
  });

  autoTable(doc, {
    body: [
        [
            {
                content: `Reference: #BILL${orderData.OrderID}`
                    +'\nBill Date: ' + getCurrentDate()
                    +'\nBill Number:'+ getRandomNumber(1,1000),
                styles: {
                    halign: 'right'
                }
            }
        ],
    ],
    theme: 'plain'
});

autoTable(doc, {
    body: [
        [
            {
                content: 'Billed to:'
                    +'\n' + `${orderData.FullName}`
                    +'\n' + `${orderData.Address}`
                    +'\n' + `${orderData.Email}`
                    +'\n' + `${orderData.ContactNumber}`
                    +'\nIndia',
                styles: {
                    halign: 'left'
                }
            },
            // {
            //     content: 'Shipping address:'
            //         +'\n' + FullName
            //         +'\n' + Address
            //         +'\nZip code - City'
            //         +'\nCountry',
            //     styles: {
            //         halign: 'left'
            //     }
            // },
            {
                content: 'From:'
                    +'\nCompany name'
                    +'\nAddress line 1'
                    +'\nAddress line 2'
                    +'\nZip code - City'
                    +'\nCountry',
                styles: {
                    halign: 'right'
                }
            }
        ],
    ],
    theme: 'plain'
});

  autoTable(doc, {
    body: [
      [
        {
          content: 'Amount Paid:',
          styles: {
            halign:'right',
            fontSize: 14
          }
        }
      ],
      [
        {
          content: `${calculateTotalWithGST(orderData.TotalAmount)}`,
          styles: {
            halign:'right',
            fontSize: 20,
            textColor: '#3366ff'
          }
        }
      ],
      [
        {
          content: `Due date: ${formatDate(orderData.OrderDate)}`,
          styles: {
            halign:'right'
          }
        }
      ]
    ],
    theme: 'plain'
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Billed Items',
          styles: {
            halign:'left',
            fontSize: 14
          }
        }
      ]
    ],
    theme: 'plain'
  });

  autoTable(doc, {
    head: [['Items', 'Quantity', 'UnitPrice', 'Total Amount']],
    body: orderData.ProductDetails.map(product => [
        product.ProductName,
        product.Quantity,
        `${product.UnitPrice}`, 
        `${product.Quantity * product.UnitPrice}` 
    ]),
    theme: 'striped',
    headStyles:{
        fillColor: '#343a40'
    }
});


  const subtotal = orderData.ProductDetails.reduce((total, product) => {
      return total + (product.Quantity * product.UnitPrice);
  }, 0);

  autoTable(doc, {
    body: [
      [
        {
          content: 'Subtotal:',
          styles:{
            halign:'right'
          }
        },
        {
          content: `${subtotal}`,
          styles:{
            halign:'right'
          }
        },
      ],
      [
        {
          content: 'GST Rate:',
          styles:{
            halign:'right'
          }
        },
        {
          content: '18% / 0.18',
          styles:{
            halign:'right'
          }
        },
      ],
      [
        {
          content: 'Total amount:',
          styles:{
            halign:'right'
          }
        },
        {
          content:  `${calculateTotalWithGST(orderData.TotalAmount)}`,
          styles:{
            halign:'right'
          }
        },
      ],
    ],
    theme: 'plain'
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Terms & notes',
          styles: {
            halign: 'left',
            fontSize: 14
          }
        }
      ],
      [
        {
          content: `This is a computer generated bill\n`
              + `so this will not be valid without a seal\n`
              + `Malpractice / forgery is offensive`,
          styles: {
            halign: 'left'
          }
        }
      ],
    ],
    theme: "plain"
  });

  autoTable(doc, {
    body: [
      [
        {
          content: 'Thank you for ordering from us!',
          styles: {
            halign: 'center'
          }
        }
      ]
    ],
    theme: "plain"
  });

  doc.save(`bill${orderData.OrderID}`);
}

export const generateSalesReport = (data) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text("INVENTORY STORE SALES REPORT", 10, 20);
  doc.setFontSize(13);
  doc.text(`Report Generated at: ${formatDate(new Date())}`, 10, 30);

  let startY = 40;

  data.forEach((person) => {
    doc.setFontSize(15);
    doc.text(`Customer Name: ${person.FullName} | Order ID: ${person.OrderID}`, 10, startY);
    startY += 10;
    doc.setFontSize(10);
    doc.text(`Order Date: ${formatDate(person.OrderDate)}`, 10, startY);
    startY += 5;

    let tableData = person.ProductDetails.map((product) => {
      return [product.ProductName, product.Quantity, product.UnitPrice, product.Quantity * product.UnitPrice];
    });

    autoTable(doc, {
      head: [['Product Name', 'Quantity', 'Unit Price', 'Total Amount']],
      startY,
      body: tableData,
      didDrawPage: function (data) {
        var str = "Inventory Store Report | Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
    });

    startY += tableData.length * 6 + 20; // Adjust startY for the next customer
  });

  doc.save('sales-report.pdf');
};
// export const generateSalesReport = (data) => {
//   data.map((data)=>{
//     console.log(data);
//   })
//   console.log(data.ProductDetails);
//   const doc = new jsPDF()
//   doc.setFontSize(22);
//   doc.text("IVENTORY STORE SALES REPORT", 10, 20);
//   doc.setFontSize(13);
//   doc.text(`Reported Generated at: ${formatDate(new Date())}`, 10, 30);
//   doc.setFontSize(15);
//   doc.text(`Address:`, 10, 40);
//   doc.setFontSize(10);
//   doc.text(`No: 7238, Wing-2`, 12, 45);
//   doc.text(`Random building,`, 12, 50);
//   doc.text(`Phase 2`, 12, 55);
//   doc.text(`Random P.O`, 12, 60);
//   doc.text(`682303`, 12, 65);
//   doc.text(`Kerala,India`, 12, 70);
//   doc.text(`mail@InventoryStore.xyz`, 12, 75);


//   let tableData = data.map((item) => {
//     return item.ProductDetails.map((product) => {
//       return [product.ProductName, product.Quantity, product.UnitPrice, product.Quantity * product.UnitPrice];
//     });
//   }).flat();

//   autoTable(doc, {
//     head: [['Product Name', 'Quantity', 'Unit Price', 'Total Amount']],
//     startY: 80,
//     body: tableData,
//     didDrawPage: function (data) {
//       var str = "Inventory Store Report | Page " + doc.internal.getNumberOfPages();
//       doc.setFontSize(10);
//       var pageSize = doc.internal.pageSize;
//       var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
//       doc.text(str, data.settings.margin.left, pageHeight - 10);
//     },
//   });

//   doc.save('sales-report.pdf');
// };

