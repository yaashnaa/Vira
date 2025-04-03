import { deleteAccount } from "@/utils/auth"; // update path accordingly
import { useRouter, router } from "expo-router";
import { Button } from "react-native-paper";
export default function DeleteButton() {
    const handleDelete = async () => {
        try {
          await deleteAccount();
          alert("Account deleted successfully.");
          router.replace("/(auth)/signup"); // Redirect to login page
          // Optionally redirect to login page
        } catch (error: any) {
          alert(error.message);
        }
}

  return (
    <Button mode="contained" onPress={handleDelete} theme={{ colors: { primary: '#E7D2CF' } }} >
      Delete Account
    </Button>
  );
};
