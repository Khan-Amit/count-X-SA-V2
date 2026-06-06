// Replace your existing download function with this:

function exportCurrentTabResults() {
    // Get the currently active tab
    const activeTab = document.querySelector('.tab.active')?.id || 'incomeTab';
    
    let exportContent = '';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    if (activeTab === 'incomeTab') {
        // Get values from Income Tax tab
        const grossIncome = document.getElementById('grossIncome')?.value || 0;
        const rebateAmount = document.getElementById('rebateAmount')?.value || 0;
        const netTaxDisplay = document.getElementById('netTax')?.innerText || '0';
        
        exportContent = `=== INCOME TAX CALCULATION ===
Date: ${new Date().toLocaleString()}
----------------------------------------
Gross Income: $${parseFloat(grossIncome).toLocaleString()}
Rebate / Deduction: $${parseFloat(rebateAmount).toLocaleString()}
----------------------------------------
NET TAX PAYABLE: $${netTaxDisplay}
========================================`;
    } 
    else if (activeTab === 'importTab') {
        // Get values from Import tab
        const cifValue = document.getElementById('cifValue')?.value || 0;
        const dutyPct = document.getElementById('dutyPercent')?.value || 0;
        const vatPct = document.getElementById('vatPercent')?.value || 0;
        const aitPct = document.getElementById('aitPercent')?.value || 0;
        
        // Calculate if not already calculated in UI
        const duty = parseFloat(cifValue) * (parseFloat(dutyPct) / 100);
        const vat = (parseFloat(cifValue) + duty) * (parseFloat(vatPct) / 100);
        const ait = (parseFloat(cifValue) + duty + vat) * (parseFloat(aitPct) / 100);
        const totalLanded = parseFloat(cifValue) + duty + vat + ait;
        
        exportContent = `=== IMPORT CALCULATION ===
Date: ${new Date().toLocaleString()}
----------------------------------------
CIF Value (Cost, Insurance, Freight): $${parseFloat(cifValue).toLocaleString()}
Duty (${dutyPct}%): $${duty.toLocaleString()}
VAT (${vatPct}%): $${vat.toLocaleString()}
AIT (${aitPct}%): $${ait.toLocaleString()}
----------------------------------------
TOTAL LANDED COST: $${totalLanded.toLocaleString()}
========================================`;
    }
    else {
        // Export both tabs as summary
        exportContent = generateFullReport();
    }
    
    // Download as .txt file
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `count_it_export_${activeTab}_${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function generateFullReport() {
    // Get Income values
    const grossIncome = document.getElementById('grossIncome')?.value || 0;
    const rebateAmount = document.getElementById('rebateAmount')?.value || 0;
    const netTax = document.getElementById('netTax')?.innerText || '0';
    
    // Get Import values
    const cifValue = document.getElementById('cifValue')?.value || 0;
    const dutyPct = document.getElementById('dutyPercent')?.value || 0;
    const vatPct = document.getElementById('vatPercent')?.value || 0;
    const aitPct = document.getElementById('aitPercent')?.value || 0;
    
    const duty = parseFloat(cifValue) * (parseFloat(dutyPct) / 100);
    const vat = (parseFloat(cifValue) + duty) * (parseFloat(vatPct) / 100);
    const ait = (parseFloat(cifValue) + duty + vat) * (parseFloat(aitPct) / 100);
    const totalLanded = parseFloat(cifValue) + duty + vat + ait;
    
    return `=== COUNT IT - COMPLETE REPORT ===
Date: ${new Date().toLocaleString()}
========================================

INCOME TAX CALCULATION:
----------------------------------------
Gross Income: $${parseFloat(grossIncome).toLocaleString()}
Rebate/Deduction: $${parseFloat(rebateAmount).toLocaleString()}
Net Tax Payable: $${netTax}
----------------------------------------

IMPORT CALCULATION:
----------------------------------------
CIF Value: $${parseFloat(cifValue).toLocaleString()}
Duty (${dutyPct}%): $${duty.toLocaleString()}
VAT (${vatPct}%): $${vat.toLocaleString()}
AIT (${aitPct}%): $${ait.toLocaleString()}
Total Landed Cost: $${totalLanded.toLocaleString()}
========================================`;
}

// Attach to your download button (modify your existing button event listener)
document.getElementById('downloadBtn')?.addEventListener('click', exportCurrentTabResults);
