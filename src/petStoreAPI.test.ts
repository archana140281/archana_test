import axios, { AxiosError } from 'axios';

const apiUrl = 'https://petstore.swagger.io/v2';

describe('Pet Store API', () => {
  it('should get a pet by ID', async () => {
    const petId = 1;
    const response = await axios.get(`${apiUrl}/pet/${petId}`);

    // Validate status code
    expect(response.status).toBe(200);

    // Validate response body
    expect(response.data.id).toBe(petId);
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('status');
  });

  it('should add a new pet', async () => {
    const newPet = {
      id: 2,
      name: 'Buddy',
      status: 'available',
    };
    const response = await axios.post(`${apiUrl}/pet`, newPet);

    // Validate status code
    expect(response.status).toBe(200);

    // Validate response body
    expect(response.data.name).toBe(newPet.name);
    expect(response.data.status).toBe(newPet.status);
    expect(response.data.id).toBe(newPet.id);
  });

  it('should update a pet', async () => {
    const updatedPet = {
      id: 1,
      name: 'Updated Buddy',
      status: 'sold',
    };
    const response = await axios.put(`${apiUrl}/pet`, updatedPet);

    // Validate status code
    expect(response.status).toBe(200);

    // Validate response body
    expect(response.data.name).toBe(updatedPet.name);
    expect(response.data.status).toBe(updatedPet.status);
  });

  //   it('should delete a pet', async () => {
  //     const petId = 2;
  //     const response = await axios.delete(`${apiUrl}/pet/${petId}`);

  //     // Log the full response to verify the message field
  //     console.log(response.data);

  //     // Validate status code
  //     expect(response.status).toBe(200);

  //     // Adjust the test to check if the message is the pet ID that was deleted
  //     expect(response.data.message).toBe(String(petId)); // message contains the pet ID as a string
  //   });

  it('should delete a pet and verify deletion', async () => {
    const petId = 2;

    try {
      // First, verify if the pet exists
      const getResponse = await axios.get(`${apiUrl}/pet/${petId}`);
      console.log('Pet found:', getResponse.data);
    } catch (error: unknown) {
      // Assert that error is of type AxiosError
      if ((error as AxiosError).response?.status === 404) {
        console.log('Pet not found. Proceeding with the delete test.');
      } else {
        throw error; // Re-throw other errors
      }
    }

    try {
      // Now, delete the pet
      const deleteResponse = await axios.delete(`${apiUrl}/pet/${petId}`);
      console.log(deleteResponse.data);

      // Validate status code for delete
      expect(deleteResponse.status).toBe(200);

      // Validate response message (which contains the pet ID)
      expect(deleteResponse.data.message).toBe(String(petId));

      // After deletion, try to fetch the pet again and expect a 404
      try {
        await axios.get(`${apiUrl}/pet/${petId}`);
      } catch (error: unknown) {
        // Assert that error is of type AxiosError
        const axiosError = error as AxiosError;
        expect(axiosError.response?.status).toBe(404); // Pet should no longer exist
      }
    } catch (error: unknown) {
      // If delete fails, assert the expected error response
      const axiosError = error as AxiosError;
      expect(axiosError.response?.status).toBe(404); // Ensure delete failed if the pet doesn't exist
    }
  });

  it('should return an error when adding a pet without a name', async () => {
    const newPet = {
      id: 12346, // No "name" field
      status: 'available',
    };

    try {
      await axios.post(`${apiUrl}/pet`, newPet);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      // Log response
      console.log(axiosError.response?.data);

      // Validate status code
      expect(axiosError.response?.status).toBe(400);
    }
  });

  it('should return 404 when getting a non-existent pet', async () => {
    const petId = 999999; // ID that does not exist

    try {
      await axios.get(`${apiUrl}/pet/${petId}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      // Log response
      console.log(axiosError.response?.data);

      // Validate status code
      expect(axiosError.response?.status).toBe(404);
    }
  });
});
