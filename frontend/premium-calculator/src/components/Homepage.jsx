import { Autocomplete, Slider } from "@mui/joy";
import { useEffect, useState } from "react";
import Calculator from "./Calculator";
function Homepage() {
  const [selectedValue, setSelectedValue] = useState("");
  const [numberInputs, setNumberInputs] = useState([]);
  const [personDetails, setPersonDetails] = useState([]);
  const [premiumDetails, setpremiumDetails] = useState([]);
  const [sumInsured, setsumInsured] = useState(0);
  const [isClicked, setisClicked] = useState(false);
  const [cart, setCart] = useState([]);

  const handleMemberCsvInput = (event, value) => {
    setSelectedValue(value);
    const familySize = value.split(",").reduce((total, val) => {
      const num = parseInt(val);
      return isNaN(num) ? total : total + num;
    }, 0);
    setNumberInputs(
      Array.from({ length: familySize }, (_, index) => index + 1)
    );
    setPersonDetails([]);
  };
  const handleSumInsuredInput = (event, value) => {
    setsumInsured(value);
  };

  const handleAgeChange = (index, age_range) => {
    const updatedPersons = [...personDetails];
    updatedPersons[index] = { ...updatedPersons[index], age_range };
    setPersonDetails(updatedPersons);
  };

  const handleTierChange = (index, tier) => {
    const updatedPersons = [...personDetails];
    updatedPersons[index] = { ...updatedPersons[index], tier };
    setPersonDetails(updatedPersons);
  };

  const handleTenureChange = (index, tenure) => {
    const updatedPersons = [...personDetails];
    updatedPersons[index] = { ...updatedPersons[index], tenure };
    setPersonDetails(updatedPersons);
  };
  const handleSumChange = (index, sum_insured) => {
    const updatedPersons = [...personDetails];
    updatedPersons[index] = { ...updatedPersons[index], sum_insured };
    setPersonDetails(updatedPersons);
  };

  useEffect(() => {
    const url = `http://127.0.0.1:5000/get_premium?member_csv=${selectedValue}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setpremiumDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [isClicked]);

  return (
    <div className="flex mt-14 ml-4">
      <div className="flex justify-center flex-col mx-auto">
        <div className="flex justify-center">
          <div className="bg-[#424243] flex flex-col gap-3 p-8 border-2 rounded-lg">
            <h1 className="text-center text-white text-[24px]">
              Premium Calculator
            </h1>
            <Autocomplete
              options={[
                "1a",
                "1a,1c",
                "1a,3c",
                "1a,4c",
                "2a",
                "2a,1c",
                "2a,2c",
                "2a,3c",
                "2a,4c",
              ]}
              placeholder="choose your family size"
              multiple={false}
              variant="solid"
              onChange={handleMemberCsvInput}
              value={selectedValue}
            />
            {numberInputs.map((inputIndex) => (
              <div key={inputIndex}>
                <p className="text-white font-bold text-[18px] ">
                  Person {inputIndex} Details
                </p>
                <label htmlFor="" className="text-white relative bottom-1">
                  Choose your sum
                </label>
                <Autocomplete
                  options={[
                    "500000",
                    "700000",
                    "1000000",
                    "1500000",
                    "2000000",
                    "2500000",
                    "3000000",
                    "6000000",
                    "7500000",
                  ]}
                  onChange={(event, value) => {
                    handleSumChange(inputIndex - 1, value);
                    handleSumInsuredInput;
                  }}
                  placeholder="choose your sum insured"
                  multiple={false}
                  variant="solid"
                />

                <label htmlFor="" className="text-white relative top-1">
                  Choose your age
                </label>
                <Slider
                  min={18}
                  max={99}
                  step={1}
                  color="neutral"
                  valueLabelDisplay="auto"
                  onChange={(event, value) =>
                    handleAgeChange(inputIndex - 1, value)
                  }
                />
                <label htmlFor="" className="text-white relative bottom-2">
                  Choose your tier
                </label>
                <Autocomplete
                  options={["tier-1"]}
                  placeholder="choose your tier"
                  multiple={false}
                  variant="solid"
                  onChange={(event, value) =>
                    handleTierChange(inputIndex - 1, value)
                  }
                />
                <label
                  htmlFor="slider-tenure"
                  className="text-white relative top-2"
                >
                  Choose your tenure
                </label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  color="neutral"
                  valueLabelDisplay="auto"
                  onChange={(event, value) =>
                    handleTenureChange(inputIndex - 1, value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className="my-4 bg-[#706be4] text-white rounded-sm p-3 text-lg"
          onClick={() => setisClicked(!isClicked)}
        >
          Calculate
        </button>
      </div>
      {isClicked && premiumDetails.length !== 0 ? (
        <div>
          <Calculator
            details={premiumDetails}
            personDetails={personDetails}
            sum={sumInsured}
            buttonClicked={isClicked}
            setCart={setCart}
            cart={cart}
          />
          <div className="mt-12 ml-20">
            <h2 className="text-lg font-semibold text-white mb-2">Purchased Premiums</h2>
            <ul className="text-white">
              {cart.map((item, index) => (
                <li key={index}>
                  {item.tier} - {item.sum_insured} - {item.tenure} - {item.age}{" "}
                  - {item.premiumForThatAge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Homepage;
