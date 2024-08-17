export const newInstagramAccount = async (numbers: string[]) => {
    try {
      const requests = numbers.map((to) => 
        fetch('/api/instagram-announcement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ to }),
        })
        .then(response => ({
          to,
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        }))
        .catch(error => ({
          to,
          status: 'failed',
          ok: false,
          statusText: error.message,
        }))
      );
  
      // Wait for all requests to complete
      const results = await Promise.all(requests);
  
      // Return the status of each request
      return results.map(result => result.status);
    } catch (error) {
      console.log('An unexpected error occurred:', error);
      throw error;
    }
  };
  