import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Car } from "@/components/CarCard";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const carsCollection = collection(db, "cars");
export interface ProcessedImage {
  base64?: string;
  url?: string;
  originalName: string;
  size: number;
  type: string;
  storageRef?: string;
}

export interface FirebaseCar {
  id: string;
  title: string;
  description?: string;
  link?: string;
  images: ProcessedImage[] | string[];
  active: boolean;
  updatedAt: any;
  category?: string;
  codeVehicle?: string;
  color?: string;
  inPreparation?: boolean;
  inTransit?: boolean;
  isConsignment?: boolean;
  isSemiNovo?: boolean;
  isShielding?: boolean;
  isZeroKm?: boolean;
  km?: string;
  observation?: string;
  plate?: string;
  price?: string;
  technicalSheet?: string;
  typeOfArmor?: string;
  year?: string;
  yearModel?: string;
}

const convertFirebaseCarToCar = (firebaseCar: FirebaseCar): Car => {
  const titleParts = firebaseCar.title.split(" ");
  const brand = titleParts[0] || "";
  const model = titleParts.slice(1, 3).join(" ") || "";

  const firstImage =
    Array.isArray(firebaseCar.images) && firebaseCar.images.length > 0
      ? typeof firebaseCar.images[0] === "string"
        ? firebaseCar.images[0]
        : (firebaseCar.images[0] as ProcessedImage).url ||
        (firebaseCar.images[0] as ProcessedImage).base64 ||
        ""
      : "";

  return {
    id: firebaseCar.id,
    title: firebaseCar.title,
    description: firebaseCar.description || "",
    link: firebaseCar.link || "N/A",
    brand,
    model,
    price: firebaseCar.price || "",
    images: [{ url: firstImage, originalName: "", size: 0, type: "" }],
    mileage: parseInt(firebaseCar.km || "0") || 0,
    active: firebaseCar.active,
    updatedAt: firebaseCar.updatedAt,
    year: parseInt(firebaseCar.year || "") || undefined,
    km: parseInt(firebaseCar.km || "0") || 0,
    inPreparation: firebaseCar.inPreparation || false,
    plate: firebaseCar.plate || "",
    isConsignment: firebaseCar.isConsignment || false,
    isZeroKm: firebaseCar.isZeroKm || false,
    inTransit: firebaseCar.inTransit || false,
    isSemiNovo: firebaseCar.isSemiNovo || false,
    codeVehicle: firebaseCar.codeVehicle || "",
    isShielding: firebaseCar.isShielding || false,
    category: firebaseCar.category,
    color: firebaseCar.color,
    observation: firebaseCar.observation,
    technicalSheet: firebaseCar.technicalSheet,
    typeOfArmor: firebaseCar.typeOfArmor,
    yearModel: firebaseCar.yearModel,
  };
};

export const getAllCars = async (): Promise<Car[]> => {
  try {
    const q = query(carsCollection, where("active", "==", true));
    const querySnapshot = await getDocs(q);
    const cars: Car[] = [];
    querySnapshot.forEach((doc) => {
      const firebaseCar = { id: doc.id, ...doc.data() } as FirebaseCar;
      if (firebaseCar.images && firebaseCar.images.length >= 2) {
        cars.push(convertFirebaseCarToCar(firebaseCar));
      }
    });
    cars.sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        const dateA = a.updatedAt.toDate
          ? a.updatedAt.toDate()
          : new Date(a.updatedAt);
        const dateB = b.updatedAt.toDate
          ? b.updatedAt.toDate()
          : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      }
      return 0;
    });

    return cars;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};
