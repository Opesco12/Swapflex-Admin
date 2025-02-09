import { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import app from "../../firebaseconfig";
import { toast } from "react-toastify";

const Admin = () => {
  const [status, setStatus] = useState("");
  const [rates, setRates] = useState([]);
  const [payments, setPayments] = useState(null);
  const [exchangeAccount, setExchangeAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    rates: false,
    payments: false,
    account: false,
  });
  const db = getDatabase(app);

  useEffect(() => {
    const unsubscribes = [];

    const fetchData = (path, setter) => {
      const dataRef = ref(db, path);
      unsubscribes.push(
        onValue(dataRef, (snapshot) => {
          const data = snapshot.val();
          if (path === "exchangeRates") {
            const formattedRates = Object.entries(data).map(([key, value]) => ({
              currency: key,
              rate: value,
            }));
            setter(formattedRates);
          } else {
            setter(data);
          }
        })
      );
    };

    fetchData("exchangeRates", setRates);
    fetchData("payments", setPayments);
    fetchData("currencyExchangeAccount", setExchangeAccount);
    setLoading(false);

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  const handleSave = async (section, data) => {
    try {
      // setStatus(`Saving ${section}...`);
      toast.info(`Saving ${section}...`);
      let path = "";
      let formattedData = data;

      switch (section) {
        case "rates":
          path = "exchangeRates";
          formattedData = data.reduce((acc, rate) => {
            acc[rate.currency] = rate.rate;
            return acc;
          }, {});
          break;
        case "payments":
          path = "payments";
          break;
        case "account":
          path = "currencyExchangeAccount";
          break;
      }

      await set(ref(db, path), formattedData);
      // setStatus(`${section} updated successfully!`);
      toast.success(`${section} updated succesfully`);
      setEditMode({ ...editMode, [section]: false });
    } catch (error) {
      // setStatus(`Error updating ${section}. Please try again.`);

      toast.error(`Error updating ${section}. Please try again.`);
    }
  };

  const EditableField = ({ label, value, onChange, type = "text" }) => (
    <div className="mb-2 ">
      <label className="block text-sm font-medium text-silver">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
      />
    </div>
  );

  const EditablePaymentSection = ({ title, data, onSave, onCancel }) => {
    const [editedData, setEditedData] = useState(data);

    const handleFieldChange = (key, value) => {
      setEditedData({ ...editedData, [key]: value });
    };

    return (
      <div className="mb-6 p-4 bg-lightBG rounded-lg shadow">
        <h4 className="text-xl font-semibold mb-4 text-silver">{title}</h4>
        {Object.entries(editedData).map(([key, value]) => (
          <EditableField
            key={key}
            label={key}
            value={value}
            onChange={(newValue) => handleFieldChange(key, newValue)}
          />
        ))}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => onSave(editedData)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const EditableAccountSection = ({ data, onSave, onCancel }) => {
    const [editedData, setEditedData] = useState(data);

    const handleFieldChange = (currency, field, value) => {
      setEditedData({
        ...editedData,
        [currency]: {
          ...editedData[currency],
          [field]: value,
        },
      });
    };

    return (
      <div className="bg-lightBG p-4 shadow-lg rounded-lg">
        {Object.entries(editedData).map(([currency, details]) => (
          <div
            key={currency}
            className="mb-4 "
          >
            <h5 className="font-semibold mb-2 text-silver">
              {currency} Account
            </h5>
            <div className="ml-4 space-y-2">
              {Object.entries(details).map(([field, value]) => (
                <EditableField
                  key={field}
                  label={field}
                  value={value}
                  onChange={(newValue) =>
                    handleFieldChange(currency, field, newValue)
                  }
                />
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => onSave(editedData)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen px-[20px] max-w-[920px] mx-auto py-8">
      <h3 className="text-center text-2xl font-bold mb-10 text-silver">
        Swapflex Admin Page
      </h3>

      {/* Exchange Rates Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4 text-silver">
          Exchange Rates
        </h4>
        <div className="bg-lightBG p-4 shadow-lg rounded-lg overflow-hidden">
          {editMode.rates ? (
            <div className="space-y-4">
              {rates.map((rate, index) => (
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
                    step="0.001"
                    value={rate.rate}
                    onChange={(e) => {
                      const newRates = [...rates];
                      newRates[index].rate = parseFloat(e.target.value);
                      setRates(newRates);
                    }}
                    className="col-span-3 p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <button
                  onClick={() => handleSave("rates", rates)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode({ ...editMode, rates: false })}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-4">
                {rates.map((rate, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="text-lg font-medium text-silver">
                      {rate.currency}:
                    </span>
                    <span className="text-lg text-silver">{rate.rate}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setEditMode({ ...editMode, rates: true })}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Rates
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-4 text-silver">
          Payment Methods
        </h4>
        {payments &&
          (editMode.payments ? (
            <div className="space-y-4">
              {Object.entries(payments).map(([method, data]) => (
                <EditablePaymentSection
                  key={method}
                  title={method}
                  data={data}
                  onSave={(updatedData) => {
                    const newPayments = { ...payments, [method]: updatedData };
                    handleSave("payments", newPayments);
                  }}
                  onCancel={() => setEditMode({ ...editMode, payments: false })}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(payments).map(([method, data]) => (
                <div
                  key={method}
                  className="mb-6 p-4 bg-lightBG rounded-lg shadow"
                >
                  <h4 className="text-xl font-semibold mb-4 text-silver">
                    {method}
                  </h4>
                  {Object.entries(data).map(([key, value]) => (
                    <div
                      key={key}
                      className="ml-4 mb-2"
                    >
                      <span className="font-medium text-silver">{key}: </span>
                      <span className="text-gray-700 text-silver">{value}</span>
                    </div>
                  ))}
                </div>
              ))}
              <button
                onClick={() => setEditMode({ ...editMode, payments: true })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Payment Methods
              </button>
            </div>
          ))}
      </div>

      {/* Currency Exchange Account Section */}
      <div className="mb-8 b">
        <h4 className="text-xl font-semibold mb-4 text-silver">
          Currency Exchange Account
        </h4>
        {exchangeAccount && (
          <>
            {editMode.account ? (
              <EditableAccountSection
                data={exchangeAccount}
                onSave={(updatedData) => handleSave("account", updatedData)}
                onCancel={() => setEditMode({ ...editMode, account: false })}
              />
            ) : (
              <div className="bg-lightBG p-4 shadow-lg rounded-lg">
                {Object.entries(exchangeAccount).map(([currency, details]) => (
                  <div
                    key={currency}
                    className="mb-4"
                  >
                    <h5 className="font-semibold mb-2 text-silver">
                      {currency} Account
                    </h5>
                    <div className="ml-4 space-y-2">
                      {Object.entries(details).map(([field, value]) => (
                        <p key={field}>
                          <span className="font-medium text-silver">
                            {field}:{" "}
                          </span>
                          <span className="text-silver">{value}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setEditMode({ ...editMode, account: true })}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Account Details
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* {status && (
        <div className="mt-4 p-2 bg-gray-100 border-l-4 border-blue-500 text-blue-700">
          {status}
        </div>
      )} */}
    </div>
  );
};

export default Admin;
