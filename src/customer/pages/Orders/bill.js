import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateTotalWithGST } from '../../../utils/utils';

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
    head: [['Items',  'Quantity', 'UnitPrice', 'Total Amount']],
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
          content: 'orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia'
          +'molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum'
          +'numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium',
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

  doc.save("invoice");
}