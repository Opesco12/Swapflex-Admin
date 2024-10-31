import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { getDatabase, ref, onValue, set } from "firebase/database";
import app from "../firebaseconfig";

const Admin = () => {
  const [status, setStatus] = useState("");
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Track whether in edit mode
  const db = getDatabase(app);

  // Fetch exchange rates from the database
  useEffect(() => {
    const ratesRef = ref(db, "exchangeRates");
    const unsubscribe = onValue(ratesRef, (snapshot) => {
      const data = snapshot.val();
      const formattedRates = Object.entries(data).map(([key, value]) => ({
        currency: key,
        rate: value,
      }));
      setRates(formattedRates);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateRate = async (currency, rate) => {
    // if (!isAdmin) {
    //   throw new Error('Only admin users can update exchange rates');
    // }

    try {
      await set(ref(db, `exchangeRates/${currency}`), rate);
    } catch (error) {
      console.error("Error updating exchange rate:", error);
      throw error;
    }
  };

  const formik = useFormik({
    initialValues: {
      rates: rates,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setStatus("Saving rates...");
        const updates = values.rates.reduce((acc, rate) => {
          acc[rate.currency] = rate.rate;
          return acc;
        }, {});

        // Update the Firebase database
        await set(ref(db, "exchangeRates"), updates);
        setStatus("Rates updated successfully!");
        setEditMode(false); // Exit edit mode after saving
      } catch (error) {
        setStatus("Error updating rates. Please try again.");
      }
    },
  });

  const handleRateChange = (index, value) => {
    const newRates = [...formik.values.rates];
    newRates[index].rate = parseFloat(value);
    formik.setFieldValue("rates", newRates);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen px-[20px] max-w-[920px] mx-auto">
      <h3 className="text-center text-2xl font-bold mb-10">
        Swapflex Admin Page
      </h3>

      <div className="container mx-auto p-4 shadow-lg rounded-lg overflow-hidden">
        {editMode ? (
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              {formik.values.rates.map((rate, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4"
                >
                  <input
                    type="text"
                    value={rate.currency}
                    disabled
                    className="col-span-1 p-2 border border-gray-300 rounded bg-gray-100"
                  />
                  <input
                    type="number"
                    step="1.000"
                    placeholder="Rate"
                    value={rate.rate}
                    onChange={(e) => handleRateChange(index, e.target.value)}
                    className="col-span-3 p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)} // Exit edit mode without saving
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="space-y-4">
              {rates.map((rate, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="text-lg font-medium">{rate.currency}:</span>
                  <span className="text-lg">{rate.rate}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setEditMode(true)} // Enter edit mode to show form
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Rates
            </button>
          </div>
        )}

        {status && (
          <div className="mt-4 p-2 bg-gray-100 border-l-4 border-blue-500 text-blue-700">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
