import { API_PROPERTIES_URL, API_PROPERTY_URL, API_SEARCH_URL } from "../endpoints";
import { Property } from "../model/Property";
import { ConflictError, UnauthorizedError } from "./errors";

export interface PropertyFetchProps {
    id: number;
    address: string;
}

export async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
      return response;
    } else {
      const errorBody = await response.json();
      const errorMessage = errorBody.message;
      console.log("Error message:", errorMessage);
      if (response.status === 401) {
        throw new UnauthorizedError(errorMessage);
      } else if (response.status === 409) {
        throw new ConflictError(errorMessage);
      } else {
        throw Error(
          "Request failed with status: " +
            response.status +
            " message: " +
            errorMessage
        );
      }
    }
}

export async function fetchProperties(): Promise<PropertyFetchProps[]> {
    const response = await fetchData(API_PROPERTIES_URL, {
        method: "GET"
    });
    const result: PropertyFetchProps[] = await response.json();
    return result;
}

export async function fetchProperty(propertyId: number): Promise<Property> {
    const response = await fetchData(`${API_PROPERTY_URL}/${propertyId}`, {
        method: "GET"
    });
    const result: Property = await response.json();
    return result;
}

export async function addPropertyApi(property: Property): Promise<Property> {
    const response = await fetchData(API_PROPERTY_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(property),
        }
    );
    const result: Property = await response.json();
    return result;
}

export async function deletePropertyApi(propertyId: number) {
    await fetchData(`${API_PROPERTY_URL}/${propertyId}`, {
      method: "DELETE",
    });
}

export async function fetchSearch(): Promise<Property[]> {
    const response = await fetchData(API_SEARCH_URL, {
        method: "GET"
    });
    const result: Property[] = await response.json();
    return result;
}  