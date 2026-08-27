// ===========================================
// M-PESA Rent Wallet
// Property Module
// Version 11.3 Enterprise
// ===========================================

"use strict";

console.log("===========================================");
console.log("M-PESA RENT WALLET");
console.log("PROPERTY MODULE VERSION 11.3");
console.log("===========================================");


// ===========================================
// Elements
// ===========================================

const createPropertyBtn =
    document.getElementById("createPropertyBtn");

const propertyName =
    document.getElementById("propertyName");

const propertyLocation =
    document.getElementById("propertyLocation");

const propertyUnits =
    document.getElementById("propertyUnits");

const monthlyRent =
    document.getElementById("monthlyRent");

const propertiesTableBody =
    document.getElementById("propertiesTableBody");

const searchProperty =
    document.getElementById("searchProperty");


// ===========================================
// Statistics
// ===========================================

const totalProperties =
    document.getElementById("totalProperties");

const totalUnits =
    document.getElementById("totalUnits");

const expectedRevenue =
    document.getElementById("expectedRevenue");


// ===========================================
// Property Storage
// ===========================================

let allProperties = [];


// ===========================================
// Current Landlord
// ===========================================

function getLandlordId() {

    if (
        typeof STORAGE === "undefined"
    ) {

        console.error(
            "STORAGE configuration is not loaded."
        );

        return null;

    }

    return localStorage.getItem(
        STORAGE.LANDLORD_ID
    );

}


// ===========================================
// Escape HTML
// ===========================================

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===========================================
// Format Currency
// ===========================================

function formatCurrency(amount) {

    return `KES ${Number(
        amount || 0
    ).toLocaleString()}`;

}


// ===========================================
// Update Statistics
// ===========================================

function updateStatistics(properties) {

    const propertyCount =
        properties.length;

    const unitCount =
        properties.reduce(

            (total, property) => {

                return total +
                    Number(property.units || 0);

            },

            0

        );


    const revenue =
        properties.reduce(

            (total, property) => {

                const units =
                    Number(property.units || 0);

                const rent =
                    Number(property.monthlyRent || 0);

                return total +
                    (units * rent);

            },

            0

        );


    if (totalProperties) {

        totalProperties.textContent =
            propertyCount;

    }


    if (totalUnits) {

        totalUnits.textContent =
            unitCount;

    }


    if (expectedRevenue) {

        expectedRevenue.textContent =
            formatCurrency(revenue);

    }

}

// ===========================================
// Render Properties
// ===========================================

function renderProperties(properties) {

    if (!propertiesTableBody) {

        console.warn(
            "propertiesTableBody not found."
        );

        return;

    }


    propertiesTableBody.innerHTML = "";


    if (!properties.length) {

        propertiesTableBody.innerHTML = `

            <tr>

                <td colspan="6"
                    class="empty-state">

                    No properties found.

                </td>

            </tr>

        `;

        return;

    }


    properties.forEach(property => {

        const row =
            document.createElement("tr");

        row.className = "property-row";


        row.innerHTML = `

            <td data-label="Code">

                <span class="property-code">
                    ${escapeHtml(
                        property.propertyCode
                    )}
                </span>

            </td>


            <td data-label="Name">

                <strong class="property-name">
                    ${escapeHtml(
                        property.propertyName
                    )}
                </strong>

            </td>


            <td data-label="Location">

                <span class="property-location">
                    📍 ${escapeHtml(
                        property.location
                    )}
                </span>

            </td>


            <td data-label="Units">

                <span class="property-units">
                    ${Number(
                        property.units || 0
                    ).toLocaleString()}
                </span>

            </td>


            <td data-label="Rent">

                <span class="property-rent">
                    ${formatCurrency(
                        property.monthlyRent
                    )}
                </span>

            </td>


            <td data-label="Actions">

                <button
                    type="button"
                    class="secondary delete-property-btn"
                    data-id="${escapeHtml(
                        property.id
                    )}"
                >
                    Delete
                </button>

            </td>

        `;


        propertiesTableBody.appendChild(row);

    });


    // ===================================
    // Delete Buttons
    // ===================================

    const deleteButtons =
        document.querySelectorAll(
            ".delete-property-btn"
        );


    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                deleteProperty(
                    button.dataset.id
                );

            }
        );

    });

}


// ===========================================
// Load Properties
// ===========================================

async function loadProperties() {

    console.log(
        "Loading properties..."
    );


    const landlordId =
        getLandlordId();


    console.log(
        "Landlord ID:",
        landlordId
    );


    if (!landlordId) {

        allProperties = [];

        updateStatistics([]);

        if (propertiesTableBody) {

            propertiesTableBody.innerHTML = `

                <tr>

                    <td colspan="6"
                        class="empty-state">

                        Register as landlord first.

                    </td>

                </tr>

            `;

        }

        return;

    }


    try {

        const response =
            await fetch(

                `/api/properties/${landlordId}`

            );


        const result =
            await response.json();


        console.log(
            "Properties API:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            throw new Error(

                result.message ||
                "Could not load properties."

            );

        }


        allProperties =
            result.properties || [];


        updateStatistics(
            allProperties
        );


        renderProperties(
            allProperties
        );

    }

    catch (error) {

        console.error(
            "Load Properties Error:",
            error
        );


        allProperties = [];

        updateStatistics([]);


        if (propertiesTableBody) {

            propertiesTableBody.innerHTML = `

                <tr>

                    <td colspan="6"
                        class="empty-state">

                        Unable to load properties.

                    </td>

                </tr>

            `;

        }

    }

}


// ===========================================
// Create Property
// ===========================================

if (createPropertyBtn) {

    createPropertyBtn.addEventListener(

        "click",

        async () => {

            const landlordId =
                getLandlordId();


            if (!landlordId) {

                alert(
                    "Please register as landlord first."
                );

                return;

            }


            const name =
                propertyName
                    ? propertyName.value.trim()
                    : "";


            const location =
                propertyLocation
                    ? propertyLocation.value.trim()
                    : "";


            const units =
                propertyUnits
                    ? Number(propertyUnits.value)
                    : 0;


            const rent =
                monthlyRent
                    ? Number(monthlyRent.value)
                    : 0;


            // ===================================
            // Validation
            // ===================================

            if (!name) {

                alert(
                    "Please enter the property name."
                );

                return;

            }


            if (!location) {

                alert(
                    "Please enter the property location."
                );

                return;

            }


            if (!Number.isFinite(units) || units < 1) {

                alert(
                    "Please enter a valid number of units."
                );

                return;

            }


            if (!Number.isFinite(rent) || rent < 1) {

                alert(
                    "Please enter a valid monthly rent."
                );

                return;

            }


            try {

                createPropertyBtn.disabled =
                    true;


                createPropertyBtn.textContent =
                    "Creating...";


                const response =
                    await fetch(

                        "/api/properties",

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    landlordId,

                                    propertyName:
                                        name,

                                    location,

                                    units,

                                    monthlyRent:
                                        rent

                                })

                        }

                    );


                const result =
                    await response.json();


                console.log(
                    "Create Property Result:",
                    result
                );


                if (
                    !response.ok ||
                    !result.success
                ) {

                    alert(

                        result.message ||
                        "Could not create property."

                    );

                    return;

                }


                alert(
                    `${result.message}\n\nProperty Code: ${result.propertyCode}`
                );


                // ===================================
                // Clear Form
                // ===================================

                if (propertyName) {

                    propertyName.value = "";

                }


                if (propertyLocation) {

                    propertyLocation.value = "";

                }


                if (propertyUnits) {

                    propertyUnits.value = "";

                }


                if (monthlyRent) {

                    monthlyRent.value = "";

                }


                // ===================================
                // Reload
                // ===================================

                await loadProperties();

            }

            catch (error) {

                console.error(
                    "Create Property Error:",
                    error
                );


                alert(
                    "Unable to create property."
                );

            }

            finally {

                createPropertyBtn.disabled =
                    false;


                createPropertyBtn.textContent =
                    "Create Property";

            }

        }

    );

}


// ===========================================
// Delete Property
// ===========================================

async function deleteProperty(propertyId) {

    if (!propertyId) {

        return;

    }


    const confirmed =
        window.confirm(

            "Are you sure you want to delete this property?"

        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(

                `/api/properties/${propertyId}`,

                {

                    method: "DELETE"

                }

            );


        const result =
            await response.json();


        console.log(
            "Delete Property Result:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            alert(

                result.message ||
                "Could not delete property."

            );

            return;

        }


        alert(
            result.message
        );


        await loadProperties();

    }

    catch (error) {

        console.error(
            "Delete Property Error:",
            error
        );


        alert(
            "Unable to delete property."
        );

    }

}


// ===========================================
// Search Properties
// ===========================================

if (searchProperty) {

    searchProperty.addEventListener(

        "input",

        () => {

            const query =
                searchProperty.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                renderProperties(
                    allProperties
                );

                return;

            }


            const filtered =
                allProperties.filter(

                    property => {

                        return (

                            String(
                                property.propertyCode || ""
                            )
                            .toLowerCase()
                            .includes(query)

                            ||

                            String(
                                property.propertyName || ""
                            )
                            .toLowerCase()
                            .includes(query)

                            ||

                            String(
                                property.location || ""
                            )
                            .toLowerCase()
                            .includes(query)

                        );

                    }

                );


            renderProperties(
                filtered
            );

        }

    );

}


// ===========================================
// Expose Functions
// ===========================================

window.loadProperties =
    loadProperties;

window.deleteProperty =
    deleteProperty;


// ===========================================
// Initial Load
// ===========================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadProperties();

    }

);


console.log(
    "✅ Property Module Version 11.3 Ready"
);