
import axios from "../axios";

export const postCompra = async (data: any) => {
  return await axios.post("api/compraCompleta", {
    ...data,
  });
};
