import { useEffect, useState } from "react";

function Calculator({ details, personDetails, sum, buttonClicked }) {
  const findPremium = (age_range, new_sum, premium_details) => {
    const valuesForSumInsured = premium_details
      .filter((premium) => isNumberInRange(age_range, premium.age_range))
      .flatMap((premium) => premium.premium_values)
      .filter((values) => values.sum_insured === new_sum)
      .map((values) => values.value);
    return valuesForSumInsured[0];
  };

  const calculatePremium = (arr) => {
    if (arr.length <= 1) {
      return arr[0].premiumForThatAge;
    } else {
      const maxValue = arr.reduce(
        (maxValue, item) => Math.max(maxValue, item.age),
        0
      );
      const total_premium = arr.reduce(
        (sum, item) =>
          sum +
          (item.age !== maxValue
            ? (item.premiumForThatAge / 2) * item.tenure
            : item.premiumForThatAge * item.tenure),
        0
      );
      return total_premium;
    }
  };

  function isNumberInRange(number, range) {
    const [min, max] = range.split("-").map(Number);
    return number >= min && number <= max;
  }
  // Store the computed premiums in state
  const [storedPremiums, setStoredPremiums] = useState([]);

  useEffect(() => {
    const computedPremiums = personDetails.map((person) => ({
      age: person.age_range,
      premiumForThatAge: findPremium(
        person.age_range,
        parseInt(person.sum_insured),
        details
      ),
      tier: person.tier,
      tenure: person.tenure,
      sum_insured: person.sum_insured,
    }));
    setStoredPremiums(computedPremiums);
  }, [personDetails, details]);
  const totalPremium =
    storedPremiums.length !== 0 ? calculatePremium(storedPremiums) : null;
  return (
    <div className="border-2 mt-32 mr-36 text-[20px]  text-white">
      {/* {<p className="text-[20px] font-bold text-white">Total Premium {totalPremium}</p>} */}
      <table>
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 text-blue-500 text-[18px]">Tier</th>
              <th className="py-2 px-4 text-blue-500 text-[18px]">
                Sum Insured
              </th>
              <th className="py-2 px-4 text-blue-500 text-[18px]">Tenure</th>
              <th className="py-2 px-4 text-blue-500 text-[18px]">Age</th>
              <th className="py-2 px-4 text-blue-500 text-[18px]">
                Premium for 1 year
              </th>
              <th className="py-2 px-4 text-blue-500 text-[18px]">
                Total premium
              </th>
            </tr>
          </thead>
          <tbody>
            {storedPremiums.map((premiumData, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{premiumData.tier}</td>
                <td className="py-2 px-4">{premiumData.sum_insured}</td>
                <td className="py-2 px-4">{premiumData.tenure}</td>
                <td className="py-2 px-4">{premiumData.age}</td>
                <td className="py-2 px-4">{premiumData.premiumForThatAge}</td>
                <td className="py-2 px-4">{(premiumData.premiumForThatAge)* (premiumData.tenure)}</td>
              </tr>
            ))}
            <tr className=" border-t bg-white">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td className="py-2 px-4 text-[#706be4] border-l-2" rowSpan={4}>
                {totalPremium}
              </td>
            </tr>
          </tbody>
        </table>
      </table>
    </div>
  );
}

export default Calculator;
