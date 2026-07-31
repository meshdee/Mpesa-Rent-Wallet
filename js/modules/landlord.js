// ===========================================
// M-PESA Rent Wallet
// Landlord Module
// Version 9.5
// ===========================================

const registerLandlordBtn = document.getElementById("registerLandlordBtn");

const businessName = document.getElementById("businessName");

const nationalId = document.getElementById("nationalId");

const landlordPhone = document.getElementById("landlordPhone");

// ===========================================
// Register Landlord
// ===========================================

async function registerLandlord() {

    const userId = localStorage.getItem(STORAGE.userId);

    if (!userId) {

        alert("Please login first.");

        return;

    }

    const data = {

        userId,

        businessName: businessName.value.trim(),

        nationalId: nationalId.value.trim(),

        phone: landlordPhone.value.trim(),

        email: localStorage.getItem(STORAGE.userEmail) || ""

    };

    try {

        const response = await fetch("/api/landlord", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {

            // Save landlord ID for the whole application

            localStorage.setItem(

                STORAGE.landlordId,

                result.landlordId

            );

            console.log(

                "Landlord ID:",

                result.landlordId

            );

            // Clear form

            businessName.value = "";

            nationalId.value = "";

            landlordPhone.value = "";

            // Continue to Property Management

            window.location.href = "properties.html";

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to register landlord.");

    }

}

// ===========================================
// Events
// ===========================================

if (registerLandlordBtn) {

    registerLandlordBtn.addEventListener(

        "click",

        registerLandlord

    );

}