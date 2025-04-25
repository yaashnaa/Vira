import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import dayjs from "dayjs";

export const fetchMealsAndTotals = async (uid: string) => {
  const start = dayjs().startOf("day").toDate();
  const end = dayjs().endOf("day").toDate();

  const q = query(
    collection(db, "users", uid, "meals"),
    where("timestamp", ">=", Timestamp.fromDate(start)),
    where("timestamp", "<=", Timestamp.fromDate(end))
  );

  const snapshot = await getDocs(q);

  let calories = 0,
    protein = 0,
    carbs = 0,
    fat = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    calories += data.calories ?? 0;
    protein += data.protein ?? 0;
    carbs += data.carbs ?? 0;
    fat += data.fat ?? 0;
  });

  return {
    mealsLogged: snapshot.size,
    totals: { calories, protein, carbs, fat },
  };
};
