import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/utils/sessionTokenAccessor";
import { SetDynamicRoute } from "@/utils/setDynamicRoute";

async function getAllProducts() {
  const url = `${process.env.DEMO_BACKEND_URL}/api/v1/products`;

  let accessToken = await getAccessToken();

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  if (resp.ok) {
    const data = await resp.json();
    return data;
  }

  // Gérez les erreurs spécifiques ici
  throw new Error(`Failed to fetch data. Status: ${resp.status}`);
}

export default async function Products() {
  const session = await getServerSession(authOptions);

  if (session && session.roles?.includes("viewer")) {
    try {
      const apiResponse = await getAllProducts();
      const products = apiResponse.data; // Extrait le tableau de produits

      return (
          <main>
            <h1 className="text-4xl text-center">Products</h1>
            <table className="border border-gray-500 text-lg ml-auto mr-auto mt-6">
              <thead>
              <tr>
                <th className="bg-blue-900 p-2 border border-gray-500">Id</th>
                <th className="bg-blue-900 p-2 border border-gray-500">Name</th>
                <th className="bg-blue-900 p-2 border border-gray-500">
                  Price
                </th>
              </tr>
              </thead>
              <tbody>
              {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-1 border border-gray-500">{p.id}</td>
                    <td className="p-1 border border-gray-500">{p.name}</td>
                    <td className="p-1 border border-gray-500">{p.price} DT</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </main>
      );
    } catch (err) {
      console.error(err);

      // Affichez l'erreur spécifique ici
      return (
          <main>
            <h1 className="text-4xl text-center">Products</h1>
            <p className="text-red-600 text-center text-lg">
              {err.message} {/* Affichez l'erreur spécifique */}
            </p>
          </main>
      );
    }
  }

  redirect("/unauthorized");
}