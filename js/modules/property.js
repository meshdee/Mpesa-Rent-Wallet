// ===========================================
// M-PESA Rent Wallet
// Property Module
// Version 11.1
// ===========================================

"use strict";

// ===========================================
// Buttons
// ===========================================

const createPropertyBtn = document.getElementById("createPropertyBtn");

// ===========================================
// Inputs
// ===========================================

const propertyName = document.getElementById("propertyName");
const propertyLocation = document.getElementById("propertyLocation");
const propertyUnits = document.getElementById("propertyUnits");
const monthlyRent = document.getElementById("monthlyRent");

// ===========================================
// Table
// ===========================================

const propertiesTableBody =
    document.getElementById("propertiesTableBody");

// ===========================================
// Current Landlord
// ===========================================

function getLandlordId() {

    return localStorage.getItem(STORAGE.LANDLORD_ID);

}

// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    console.log("====================================");
    console.log("Loading properties...");
    console.log("====================================");

    if (!propertiesTableBody) {

        console.error("❌ propertiesTableBody not found.");

        return;

    }

    const landlordId = getLandlordId();

    console.log("Current Landlord ID:", landlordId);

    if (!landlordId) {

        console.warn("No landlord registered.");

        propertiesTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Register as a landlord first.
                </td>
            </tr>
        `;

        return;

    }

    try {

        const response = await fetch(

            `/api/properties/${landlordId}`

        );

        console.log("HTTP Status:", response.status);

        const result = await response.json();

        console.log("====================================");
        console.log("API RESULT");
        console.log("====================================");
        console.log(result);

        console.log("====================================");
        console.log("SUCCESS:", result.success);
        console.log("Properties Array:", result.properties);
        console.log(
            "Properties Length:",
            result.properties ? result.properties.length : 0
        );
        console.log("====================================");

        const properties = result.properties || [];

        // ===================================
        // Update Dashboard Statistics
        // ===================================

        const propertiesCount =
            document.getElementById("propertiesCount");

        const propertyCountBadge =
            document.getElementById("propertyCountBadge");

        if (propertiesCount) {

            propertiesCount.textContent = properties.length;

        }

        if (propertyCountBadge) {

            propertyCountBadge.textContent =
                `${properties.length} properties`;

        }

        // ===================================
        // Build Table
        // ===================================

        propertiesTableBody.innerHTML = "";

        if (properties.length === 0) {

            propertiesTableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No properties registered.
                    </td>
                </tr>
            `;

            return;

        }

        properties.forEach(property => {

            console.log("Rendering Property:", property);

            propertiesTableBody.innerHTML += `
                <tr>
                    <td>${property.propertyCode}</td>
                    <td>${property.propertyName}</td>
                    <td>${property.location}</td>
                    <td>${property.units}</td>
                    <td>KES ${Number(property.monthlyRent).toLocaleString()}</td>
                </tr>
            `;

        });

        console.log("✅ Property table rendered successfully.");

    }

    catch (error) {

        console.error("❌ loadProperties Error:", error);

        propertiesTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load properties.
                </td>
            </tr>
        `;

    }

}
// ===========================================
// Create Property
// ===========================================

if (createPropertyBtn) {

    createPropertyBtn.addEventListener(

        "click",

        async () => {

            const landlordId = getLandlordId();

            if (!landlordId) {

                alert("Please register as a landlord first.");

                return;

            }

            const data = {

                landlordId,

                propertyName: propertyName.value.trim(),

                location: propertyLocation.value.trim(),

                units: Number(propertyUnits.value),

                monthlyRent: Number(monthlyRent.value)

            };

            try {

                const response = await fetch(

                    "/api/properties",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify(data)

                    }

                );

                const result = await response.json();

                alert(result.message);

                if (result.success) {

                    propertyName.value = "";

                    propertyLocation.value = "";

                    propertyUnits.value = "";

                    monthlyRent.value = "";

                    loadProperties();

                }

            }

            catch (error) {

                console.error(error);

                alert("Unable to create property.");

            }

        }

    );

}

// ===========================================
// Initialize
// ===========================================

// Make the function available to dashboard.js
window.loadProperties = loadProperties;

// Load immediately
loadProperties();

console.log("✅ Property Module Version 11.2 Loaded");