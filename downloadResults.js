// downloadResults.js - Export calculated results only

function exportCurrentTabResults() {
    const activeTab = document.querySelector('.tab.active')?.id || 'incomeTab';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    let exportContent = '';
    
    if (activeTab === 'incomeTab') {
        const grossIncome = document.getElementById('grossIncome')?.value || 0;
        const rebateAmount = document.getElementById('rebateAmount')?.value || 0;
        const netTaxDisplay = document.getElementById('netTax')?.innerText || '0';
        
        exportContent = `INCOME TAX CALCULATION
Generated: ${new Date().toLocaleString()}
----------------------------------------
Gross Income: ${formatCurrency(grossIncome)}
Rebate/Deduction: ${formatCurrency(rebateAmount)}
Net Tax Payable: ${netTaxDisplay}`;
    } 
    else if (activeTab === 'importTab') {
        const cifValue = document.getElementById('cifValue')?.value || 0;
        const dutyPct = document.getElementById('dutyPercent')?.value || 0;
        const vatPct = document.getElementById('vatPercent')?.value || 0;
        const aitPct = document.getElementById('aitPercent')?.value || 0;
        
        const duty = cifValue * (dutyPct / 100);
        const vat = (cifValue + duty) * (vatPct / 100);
        const ait = (cifValue + duty + vat) * (aitPct / 100);
        const totalLanded = cifValue + duty + vat + ait;
        
        exportContent = `IMPORT CALCULATION
Generated: ${new Date().toLocaleString()}
----------------------------------------
CIF Value: ${formatCurrency(cifValue)}
Duty (${dutyPct}%): ${formatCurrency(duty)}
VAT (${vatPct}%): ${formatCurrency(vat)}
AIT (${aitPct}%): ${formatCurrency(ait)}
Total Landed Cost: ${formatCurrency(totalLanded)}`;
    }
    
    downloadFile(exportContent, `count_it_${activeTab}_${timestamp}.txt`);
}

function formatCurrency(value) {
    return '$' + parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Replace the download button handler
document.getElementById('downloadBtn')?.addEventListener('click', exportCurrentTabResults);
