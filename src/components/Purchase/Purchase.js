import React, { useEffect, useState, useRef, useCallback } from "react";
import CheckIcon from "../../assets/check-icon.svg";
import Cart from "../../assets/shopping-cart.svg";
import Sidebar from "../Sidebar/Sidebar";

function getFPTid() {
  return window.promotekit_referral;
}

const PurchasePage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedEarlyPlan, setSelectedEarlyPlan] = useState(null);
  const [userCounts, setUserCounts] = useState({});

  const carousel = useRef(null);

  const [page, setPage] = useState(0);

  const regularPlans = [
    {
      name: "100 Events",
      price: 175,
      users: 1,
      maxUsers: 1,
      priceId: { 1: "price_1PVyfOKRSLxyO5w3kRTg4DYq" },
    },
    {
      name: "200 Events",
      price: 250,
      users: 1,
      maxUsers: 1,
      priceId: { 1: "price_1PVyhIKRSLxyO5w37yizhioE" },
    },
    {
      name: "500 Events",
      price: 600,
      users: 2,
      maxUsers: 4,
      extraUserPrice: 100,
      priceId: {
        2: "price_1PVymtKRSLxyO5w3RdZ2IpTV",
        3: "price_1PVymtKRSLxyO5w3jArC7uUL",
        4: "price_1PVymtKRSLxyO5w3wjXD2j8d",
      },
    },
    {
      name: "750 Events",
      price: 900,
      users: 2,
      maxUsers: 4,
      extraUserPrice: 75,
      priceId: {
        2: "price_1PVyt1KRSLxyO5w3O9N8apQn",
        3: "price_1PVyt1KRSLxyO5w365Tve5fc",
        4: "price_1PVyt1KRSLxyO5w36bcVYIuQ",
      },
    },
    {
      name: "1000 Events",
      price: 1200,
      users: 4,
      maxUsers: 10,
      extraUserPrice: 50,
      priceId: {
        4: "price_1PVyw0KRSLxyO5w3vwBLYQU7",
        5: "price_1PVywaKRSLxyO5w3AdE0Hs7B",
        6: "price_1PVyx0KRSLxyO5w3zlJyEgrk",
        7: "price_1PVyxHKRSLxyO5w3AyIhPpxp",
        8: "price_1PVyxZKRSLxyO5w3t69ifvEP",
        9: "price_1PVyy1KRSLxyO5w3Hg6HNaXZ",
        10: "price_1PVyyGKRSLxyO5w3VCByoXLk",
      },
    },
  ];

  const earlyPlans = [
    { name: "10 Early", price: 90, priceId: "price_1PVzBTKRSLxyO5w3Cr6EFLQZ" },
    { name: "25 Early", price: 175, priceId: "price_1PVzDpKRSLxyO5w33g6iUrpq" },
    { name: "50 Early", price: 250, priceId: "price_1PVzQ3KRSLxyO5w3UE5SQFD6" },
    {
      name: "100 Early",
      price: 350,
      priceId: "price_1PVzRsKRSLxyO5w34USWzJ9s",
    },
  ];

  const handlePlanSelection = useCallback(
    (plan) => {
      localStorage.setItem("selectedPlan", JSON.stringify(plan));
      setSelectedPlan({
        ...plan,
        selectedUsers: userCounts[plan.name] || plan.users,
      });
    },
    [userCounts]
  );

  const handleEarlyPlanSelection = useCallback(
    (plan, isLocal = false) => {
      if (selectedPlan || isLocal) {
        setSelectedEarlyPlan(plan === selectedEarlyPlan ? null : plan);
      } else {
        alert(
          "Please select a regular plan before choosing an Early Monitor plan."
        );
      }
    },
    [selectedPlan, selectedEarlyPlan]
  );

  const handleUserCountChange = (e, plan) => {
    const newUserCount = parseInt(e.target.value);

    localStorage.setItem(
      "userCounts",
      JSON.stringify({
        ...userCounts,
        [plan.name]: newUserCount,
      })
    );

    setUserCounts((prevCounts) => ({
      ...prevCounts,
      [plan.name]: newUserCount,
    }));
    if (selectedPlan && selectedPlan.name === plan.name) {
      setSelectedPlan({
        ...selectedPlan,
        selectedUsers: newUserCount,
      });
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedPlan) return 0;
    let total = selectedPlan.price;
    const currentUserCount = selectedPlan.selectedUsers || selectedPlan.users;
    if (currentUserCount > selectedPlan.users) {
      total +=
        (currentUserCount - selectedPlan.users) * selectedPlan.extraUserPrice;
    }
    if (selectedEarlyPlan) {
      total += selectedEarlyPlan.price;
    }
    return total;
  };

  const handleCheckout = async () => {
    if (!selectedPlan) {
      alert("Please select a regular plan");
      return;
    }

    const currentUserCount = selectedPlan.selectedUsers || selectedPlan.users;
    const selectedPriceId = selectedPlan.priceId[currentUserCount];

    const response = await fetch(
      "https://mg.phantomcheckerapi.com/api/stripe/checkout",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regularPlanId: selectedPriceId,
          earlyPlanId: selectedEarlyPlan ? selectedEarlyPlan.priceId : null,
          fp_tid: getFPTid(),
        }),
      }
    );

    const { url } = await response.json();
    window.location.href = url;
  };

  useEffect(() => {
    if (!window) return;

    const localSelectedPlan = localStorage.getItem("selectedPlan");
    const localSelectedEarlyPlan = localStorage.getItem("selectedEarlyPlan");

    if (localSelectedPlan) {
      handlePlanSelection(JSON.parse(localSelectedPlan));
    }

    if (localSelectedEarlyPlan) {
      handleEarlyPlanSelection(JSON.parse(localSelectedEarlyPlan), true);
    }
  }, [handleEarlyPlanSelection, handlePlanSelection]);

  useEffect(() => {
    if (!carousel.current) return;

    const carouselElement = carousel.current;
    const carouselItems = carouselElement.children;

    for (let i = 0; i < carouselItems.length; i++) {
      if (i === 1) {
        carouselItems[i].style.display = "grid";
      } else {
        carouselItems[i].style.display = "hidden";
      }
    }

    carouselElement.style.transform = `translateX(${-page * 33.33}%)`;
  }, [page]);

  return (
    <div className="bg-[#121212] flex w-full">
      <Sidebar />
      <div className="flex flex-col text-white bg-[rgba(23, 23, 23)] w-full overflow-hidden">
        <div className="w-full flex flex-col items-center mt-20">
          <div className="flex justify-between w-full px-20">
            <div className="" style={{ width: "50px" }}></div>
            <h1 className="font-bold text-4xl">Shop</h1>
            <div className="">
              <div
                onClick={() => setPage(2)}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                className="w-auto relative aspect-square p-2.5 hover:bg-[rgba(255,255,255,0.2)] transition-all duration-300 ease-in-out cursor-pointer rounded-lg shadow-2xl flex items-center justify-center"
              >
                <span className="absolute -top-2 -right-2 rounded-full bg-red-700 aspect-square w-5 flex items-center justify-center h-5">
                  {selectedPlan && selectedEarlyPlan ? 2 : selectedPlan ? 1 : 0}
                </span>
                <img className="w-6 h-auto" src={Cart} alt="Cart" />
              </div>
            </div>
          </div>
          <span className="text-[#eaeaea] text-center max-w-[600px] text-base font-medium">
            {page === 0 && <span>Select the plan you want</span>}
            {page === 1 && (
              <span>
                Early monitor is a distinct method we use to collect data from
                Ticketmaster. The data comes in 15 seconds to 15 minutes,
                typically under 1 minute, before the seats actually drop on
                Ticketmaster's front end. This is an added package the main
                product is still great and you can add early monitor later on!
              </span>
            )}
            {page === 2 && (
              <span>Review what you've selected and proceed to checkout</span>
            )}
          </span>
        </div>

        <div className="flex justify-between w-full mt-6">
          <div>
            {(page === 1 || page === 2) && (
              <button
                onClick={() => setPage(page - 1)}
                className="mx-20 px-2 py-1.5 rounded-md font-bold text-sm w-fit border hover:bg-[rgba(255,255,255,0.2)]"
              >
                Go Back
              </button>
            )}
          </div>

          <div className="flex mx-20 items-center gap-5">
            {selectedPlan && (
              <div className="flex">
                <span className="text-lg font-extrabold">
                  Total Per Month:{" "}
                  <span className="font-light text-[#d1d5db]">
                    ${calculateTotalPrice()}
                  </span>
                </span>
              </div>
            )}

            {page === 0 && selectedPlan && (
              <button
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                onClick={() => setPage(page + 1)}
                className="px-2 py-1.5 rounded-md font-bold text-sm w-fit border border- hover:bg-[rgba(255,255,255,0.2)]"
              >
                Add to Cart
              </button>
            )}
            {page === 1 && selectedEarlyPlan && (
              <button
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                onClick={() => setPage(page + 1)}
                className="px-2 py-1.5 rounded-md font-bold text-sm w-fit border border-white/20 hover:bg-[rgba(255,255,255,0.2)]"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>

        <div
          ref={carousel}
          className="flex transition-all duration-150 mx-auto relative w-[300%] overflow-hidden"
        >
          <div className="w-1/3 flex-col h-min items-stretch justify-center lg:flex-row lg:max-w-full mx-auto flex py-16 px-3.5 chlg:px-0 gap-x-3 gap-y-6">
            {regularPlans.map((plan) => (
              <div
                key={plan.priceId}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                className={`flex rounded-2xl w-full lg:w-[calc(19%)] lg:max-w-[400px] flex-col py-2 h-auto`}
              >
                <div className="font-semibold gap-4 text-center px-8 py-8 flex flex-col items-start justify-center">
                  <h1 className="flex items-start justify-start w-full text-xl lg:text-base 2xl:text-lx font-medium text-[#d1d5db] capitalize">
                    {plan.name}
                  </h1>
                  <div className="w-full items-end text-5xl lg:text-2xl 2xl:text-5xl font-extrabold flex h-full">
                    $
                    {plan.price +
                      ((userCounts[plan.name] - Object.keys(plan.priceId)[0]) *
                        plan.extraUserPrice || 0)}
                    <span className="text-[#d1d5db] text-xs font-light">
                      /month
                    </span>
                  </div>
                  <span className="text-base mt-2 font-normal h-4">
                    {plan.extraUserPrice && (
                      <li className="flex gap-2">
                        ${plan.extraUserPrice} per additional user
                      </li>
                    )}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <button
                    className={`flex hover:bg-red-600 px-3 py-2.5 rounded-lg font-medium items-center justify-center text-xl lg:text-base 2x:ltext-xl  z-50 transition-all w-full mx-auto mb-2 text-center ${
                      selectedPlan && selectedPlan.name === plan.name
                        ? "bg-red-700"
                        : "bg-white/5"
                    }`}
                    onClick={() => handlePlanSelection(plan)}
                    style={{
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {selectedPlan && selectedPlan.name === plan.name
                      ? "Selected"
                      : "Select"}
                  </button>
                </div>
                <div className="flex gap-3 flex-row w-full  items-center text-3xl font-bold px-8 justify-center py-4">
                  <div className="w-full text-base flex items-center justify-center font-light">
                    {plan.maxUsers === 1 && <span>1 User Only</span>}
                    {plan.maxUsers > 1 && (
                      <select
                        value={userCounts[plan.name] || 1}
                        onChange={(e) => handleUserCountChange(e, plan)}
                        className="w-full bg-transparent outline text-white outline-white/50 px-2 py-2.5"
                      >
                        {Object.keys(plan.priceId).map((number, i) => (
                          <option className="text-black" key={i} value={number}>
                            {number} User{i + 1 > 1 && "s"}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <ul className="flex flex-col px-8 py-6 text-left h-full text-lg lg:text-[10px]  xl:text-xs 2xl:text-lg font-light mt-4 gap-2">
                  <li className="flex gap-2">
                    <img
                      className="w-6 h-auto fill-white"
                      src={CheckIcon}
                      alt="Sidebar Logo"
                    />
                    {plan.users} User{plan.users > 1 && "s"}
                  </li>
                  {plan.maxUsers > 1 && (
                    <li className="flex gap-2">
                      <img
                        className="w-6 h-auto"
                        src={CheckIcon}
                        alt="Sidebar Logo"
                      />
                      Up to {plan.maxUsers} Users
                    </li>
                  )}

                  <li className="flex gap-2">
                    <img
                      className="w-6 h-auto"
                      src={CheckIcon}
                      alt="Sidebar Logo"
                    />
                    Supports Ticketmaster, AXS, MLB
                  </li>
                  <li className="flex gap-2">
                    <img
                      className="w-6 h-auto"
                      src={CheckIcon}
                      alt="Sidebar Logo"
                    />
                    Phantom data (based off secondary markets)
                  </li>
                  <li className="flex gap-2">
                    <img
                      className="w-6 h-auto"
                      src={CheckIcon}
                      alt="Sidebar Logo"
                    />
                    Stock monitor
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <div className="w-1/3 flex-col h-min items-stretch justify-center lg:flex-row lg:max-w-full mx-auto flex py-16 px-3.5 chlg:px-0 gap-x-3 gap-y-6">
            <button
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              onClick={() => {
                setPage(2);
                setSelectedEarlyPlan(null);
              }}
              className="w-fit mx-auto h-12 text-xl font-medium py-2 px-3 transition-all text-red-700 duration-200 hover:bg-[rgba(255,255,255,0.2)] rounded-lg"
            >
              Skip and go to Cart
            </button>
            <div className="w-full flex flex-wrap h-full justify-center py-16 px-10 gap-3">
              {earlyPlans.map((plan) => (
                <div
                  key={plan.priceId}
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  className={`flex rounded-2xl w-full lg:w-[calc(24%)] lg:max-w-[400px] flex-col h-auto`}
                >
                  <div className="font-semibold  ext-center px-8 py-8 flex flex-col items-start justify-center">
                    <div className="flex justify-center w-full mb-4">
                      <div
                        style={{
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        className="text-xs rounded-xl py-1.5 px-2 text-[#d1d5db] font-medium"
                      >
                        Add-on Package
                      </div>
                    </div>
                    <h1 className="flex items-start justify-start w-full text-xl lg:text-base 2xl:text-lx font-medium text-[#d1d5db] capitalize">
                      {plan.name} Monitor
                    </h1>

                    <div className="w-full items-end text-5xl lg:text-2xl 2xl:text-5xl font-extrabold mt-4 flex h-full">
                      ${plan.price}
                      <span className="text-[#d1d5db] text-xs font-medium">
                        /month
                      </span>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <button
                      className={`flex hover:bg-red-600 px-3 py-2.5 rounded-lg font-medium items-center justify-center text-xl lg:text-base 2x:ltext-xl  z-50 transition-all w-full mx-auto mb-2 text-center ${
                        selectedEarlyPlan &&
                        selectedEarlyPlan.name === plan.name
                          ? "bg-red-700"
                          : "bg-white/5"
                      }`}
                      onClick={() => handleEarlyPlanSelection(plan)}
                      style={{
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {selectedEarlyPlan && selectedEarlyPlan.name === plan.name
                        ? "Added"
                        : "Add"}
                    </button>
                  </div>
                  <ul className="flex flex-col text-left text-lg font-light mt-4 px-8 py-6  gap-2">
                    <li className="flex gap-2">
                      <img
                        className="w-6 h-auto"
                        src={CheckIcon}
                        alt="Sidebar Logo"
                      />
                      Includes Ticket type and Price
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3 flex items-start h-full justify-center">
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              className="w-[500px] mt-20 px-6 py-8 rounded-2xl"
            >
              <div className="relative rounded-t-lg text-xl font-semibold overflow-hidden mb-6 uppercase text-center py-3.5 shadow-2xl flex items-center justify-center">
                <h1 className="text-xl">checkout Overview</h1>
              </div>
              <ul className=" h-full w-full gap-2 px-8 py-6">
                <li className="flex justify-between">
                  <span className="font-medium text-lg">Plan</span>
                  <span className="text-[#eaeaea]">
                    {selectedPlan?.name ?? "/"}
                  </span>
                </li>
                <div className="w-full h-[1px] bg-white/5 my-3"></div>
                <li className="flex justify-between">
                  <span className="font-medium text-lg">Users</span>
                  <span className="text-[#eaeaea]">
                    {selectedPlan?.selectedUsers ?? "/"}
                  </span>
                </li>
                <div className="w-full h-[1px] bg-white/5 my-3"></div>
                <li className="flex justify-between">
                  <span className="font-medium text-lg">Addon</span>
                  <span className="text-[#eaeaea]">
                    {selectedEarlyPlan?.name ?? "/"}
                  </span>
                </li>
              </ul>

              <div className="flex flex-col justify-between items-center mt-4 mb-3 px-4 py-6">
                <div className="w-full flex justify-between mt-3 items-center">
                  <span className="text-3xl font-bold w-f">
                    Total per Month:
                  </span>
                  <span className="text-lg font-bold">
                    ${calculateTotalPrice()}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <button
                  className={`flex hover:bg-red-600 px-3 py-2.5 rounded-lg font-medium items-center justify-center text-xl  z-50 transition-all w-full mx-auto mb-2 text-center `}
                  onClick={handleCheckout}
                  style={{
                    opacity: selectedPlan ? 1 : 0.5,
                    cursor: selectedPlan ? "pointer" : "not-allowed",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
