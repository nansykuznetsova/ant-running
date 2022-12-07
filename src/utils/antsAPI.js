export const fetchAntsApi = async () => {
  const response = await fetch('https://sg-ants-server.herokuapp.com/ants');
  return await response.json();
}