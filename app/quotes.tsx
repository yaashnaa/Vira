import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

type Quote = {
  quote: string;
  author: string;
  category: string;
};

const Quotes = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Quote[]>([]);


  const getQuotes = async () => {
    try {
      const response = await fetch("https://api.api-ninjas.com/v1/quotes",{
        headers: {
          "X-Api-Key": "5lfzFXnecTTfalisLypkTQ==ncv0uNwvzedBlmM9"
        }});
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuotes();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
        nestedScrollEnabled
          data={data}
          renderItem={({ item }) => (
            <Text>
              {item.quote} - {item.author}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default Quotes;
