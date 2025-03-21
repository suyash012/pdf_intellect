/**
 * Test utility for the Summary component
 * Run in the browser console to test the summary functionality
 */

const TestSummary = {
  /**
   * Test the summary API with different parameters
   * @param {string} pdfId - The ID of the PDF to summarize
   */
  async testWithParameters(pdfId) {
    if (!pdfId) {
      console.error('No PDF ID provided');
      return;
    }
    
    console.log('=== Testing Summary Component ===');
    console.log(`Testing with PDF ID: ${pdfId}`);
    
    const lengths = ['short', 'medium', 'long'];
    const complexities = ['simplified', 'standard', 'technical'];
    
    const results = [];
    
    for (const length of lengths) {
      for (const complexity of complexities) {
        console.log(`\nTesting ${length} summary with ${complexity} language...`);
        
        try {
          const startTime = performance.now();
          
          const response = await fetch('/summarize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pdf_id: pdfId,
              length,
              complexity,
            }),
          });
          
          const data = await response.json();
          const endTime = performance.now();
          
          console.log(`Generated in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
          
          if (data.error) {
            console.error(`Error: ${data.error}`);
            results.push({
              length,
              complexity,
              success: false,
              error: data.error,
              summary: data.summary,
              time: (endTime - startTime) / 1000,
            });
          } else if (data.warning) {
            console.warn(`Warning: ${data.warning}`);
            results.push({
              length,
              complexity,
              success: true,
              warning: data.warning,
              summary: data.summary,
              time: (endTime - startTime) / 1000,
            });
          } else {
            const summaryLength = data.summary ? data.summary.length : 0;
            console.log(`Summary length: ${summaryLength} characters`);
            console.log('Summary preview:', data.summary ? data.summary.substring(0, 150) + '...' : 'No summary');
            
            results.push({
              length,
              complexity,
              success: true,
              summaryLength,
              time: (endTime - startTime) / 1000,
              summary: data.summary,
            });
          }
        } catch (error) {
          console.error('Error testing summary:', error);
          results.push({
            length,
            complexity,
            success: false,
            error: error.toString(),
            time: 0,
          });
        }
      }
    }
    
    console.log('\n=== Summary Test Results ===');
    console.table(results.map(r => ({
      length: r.length,
      complexity: r.complexity,
      success: r.success,
      time: r.time.toFixed(2) + 's',
      summaryLength: r.summaryLength || 'N/A',
      error: r.error || r.warning || '',
    })));
    
    return results;
  },
  
  /**
   * Run a health check on the summary functionality
   */
  async healthCheck() {
    try {
      console.log('Running Summary API health check...');
      
      const response = await fetch('/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdf_id: 'health-check',
          length: 'medium',
          complexity: 'standard',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Summary API is responding');
        return true;
      } else {
        console.error('❌ Summary API error:', data);
        return false;
      }
    } catch (error) {
      console.error('❌ Summary API is unreachable:', error);
      return false;
    }
  },
  
  /**
   * Monitor the summary component for updates
   * @param {number} interval - Polling interval in milliseconds
   */
  monitorSummaryComponent(interval = 1000) {
    console.log('Starting Summary component monitor...');
    
    let prevSummary = document.querySelector('.prose p')?.innerText || '';
    let counter = 0;
    
    const intervalId = setInterval(() => {
      const currentSummary = document.querySelector('.prose p')?.innerText || '';
      const loadingElem = document.querySelector('.animate-spin');
      const errorElem = document.querySelector('.text-red-500');
      const warningElem = document.querySelector('.bg-yellow-50');
      
      if (loadingElem) {
        console.log(`[${counter}] Summary is loading...`);
      } else if (errorElem) {
        console.error(`[${counter}] Summary error: ${errorElem.innerText}`);
      } else if (warningElem) {
        console.warn(`[${counter}] Summary warning: ${warningElem.innerText}`);
      } else if (currentSummary !== prevSummary) {
        console.log(`[${counter}] Summary updated! Length: ${currentSummary.length} characters`);
        prevSummary = currentSummary;
      }
      
      counter++;
    }, interval);
    
    return {
      stop: () => {
        clearInterval(intervalId);
        console.log('Summary monitor stopped');
      }
    };
  }
};

// Export for use in browser console
window.TestSummary = TestSummary;

export default TestSummary; 