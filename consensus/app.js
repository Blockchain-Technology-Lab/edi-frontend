// jQuery document ready function to ensure the DOM is fully loaded
$(document).ready(function () {
  // Define chart configurations
  const chartConfigs = [
    {
      metric: "entropy",
      containerId: "chart-container-1",
      ledgerSelectId: "ledger-select-1",
      sliderId: "timeframe-slider-1",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    },
/*    {
      metric: "entropy_percentage",
      containerId: "chart-container-2",
      ledgerSelectId: "ledger-select-2",
      sliderId: "timeframe-slider-2",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    }, */
    {
      metric: "gini",
      containerId: "chart-container-3",
      ledgerSelectId: "ledger-select-3",
      sliderId: "timeframe-slider-3",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    },
    {
      metric: "hhi",
      containerId: "chart-container-4",
      ledgerSelectId: "ledger-select-4",
      sliderId: "timeframe-slider-4",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    },
    {
      metric: "nakamoto_coefficient",
      containerId: "chart-container-5",
      ledgerSelectId: "ledger-select-5",
      sliderId: "timeframe-slider-5",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    },
    {
      metric: "theil_index",
      containerId: "chart-container-6",
      ledgerSelectId: "ledger-select-6",
      sliderId: "timeframe-slider-6",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    },
    {
      metric: "max_power_ratio",
      containerId: "chart-container-7",
      ledgerSelectId: "ledger-select-7",
      sliderId: "timeframe-slider-7",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    },
    {
      metric: "tau_index",
      containerId: "chart-container-8",
      ledgerSelectId: "ledger-select-8",
      sliderId: "timeframe-slider-8",
      onChange: (data, config, minValue, maxValue) => {
        //console.log(`Range selected for Chart 1: ${minValue} to ${maxValue}`);
        // Update Chart 1 based on selected range
        updateChart(data, config, minValue, maxValue);
      },
    },
  ];

  const valueColumns = [
    "entropy",
    //"entropy_percentage",
    "gini",
    "hhi",
    "nakamoto_coefficient",
    "theil_index",
    "max_power_ratio",
    "tau_index",
  ];

  // Define ledger names in the desired order
  const ledgerNames = [
    "bitcoin",
    "bitcoin_cash",
    "cardano",
    "dogecoin",
    "ethereum",
    "litecoin",
    "tezos",
    "zcash",
  ];

  const colours = [
    "rgba(255, 206, 86, 1)", // Yellow
    "rgba(54, 162, 235, 1)", // Blue
    "rgba(75, 192, 192, 1)", // Green
    "rgba(255, 99, 132, 1)", // Red
    "rgba(255, 159, 64, 1)", // Orange
    "rgba(153, 102, 255, 1)", // Purple
    "rgba(117, 117, 117, 1)", // Gray
    "rgba(157, 102, 89, 1)",
  ];

  // Create a ledger-to-color mapping using the colours array
  const ledgerColorMap = {};
  ledgerNames.forEach((ledger, index) => {
    ledgerColorMap[ledger] = colours[index % colours.length]; // Use modulo to cycle through colours
  });

  // Store references to chart instances
  const charts = {};

  let fileName = "output/output_clustered.csv";

  // Load CSV data and render chart

  function loadChartData(fileName) {
    fetch(fileName)
      .then((response) => response.text())
      .then((csvData) => {
        const data = parseCSV(csvData);
        renderLineChart(data);
        chartConfigs.forEach((config) => {
          //renderLineChart(data, config);
          setupCheckboxListener(data, config); // Setup checkbox listener for dynamic updates
          initializeSlider(data, config);
        });
      })
      .catch((error) => {
        console.error(`Error loading data for ${fileName}:`, error);
      });
  }

  // Function to parse the date from 'MMM-YYYY' format
  const parseDate = (dateString) => {
    // Split the date string by '-'
    const [month, year] = dateString.split("-");
    // Convert month name to a number (e.g., 'Jan' to 0, 'Feb' to 1, etc.)
    const monthNumber = moment().month(month).format("M") - 1;
    // Create a new Date object with the year and month (day defaults to 1)
    return new Date(year, monthNumber);
  };

  // Parse CSV data into structured format
  function parseCSV(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");

    //const valueColumns = ['hhi', 'shannon_entropy', 'gini', 'total_entities', 'tau=0.33', 'tau=0.5', 'tau=0.66', 'mpr', 'theil']

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      //const entry = {};

      if (values.length === headers.length) {
        const entry = {};
        headers.forEach((header, index) => {
          //console.log('Header: ', valueColumns.includes(header.trim()));
          const value = values[index].trim();
          if (header.trim() === "snapshot_date") {
            entry[header.trim()] = parseDate(value);
          } else if (header.trim() === "ledger") {
            entry[header.trim()] = value; // Store ledger name
          } else if (valueColumns.includes(header.trim())) {
            entry[header.trim()] = parseFloat(value);
          }
        });
        //console.log('Entry: ', entry)
        data.push(entry);
      }
    }
    return data;
  }

  // Render line charts for multiple metrics using Chart.js
  function renderLineChart(data, config2) {
    if (config2) {
      // Individual chart
      renderOneChart(data, config2);
    } else {
      chartConfigs.forEach((config, index) => {
        renderOneChart(data, config, index);
      });
    }
  }

  // Setup event listener for checkbox changes
  function setupCheckboxListener(data, config) {
    const dates = data.map((entry) => entry.snapshot_date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const minValue = minDate.getTime();
    const maxValue = maxDate.getTime();

    const checkboxes = document.querySelectorAll(
      `#${config.ledgerSelectId} input[type="checkbox"]`
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        updateChart(data, config, minValue, maxValue);
      });
    });
  }

  // Update chart based on selected checkboxes
  function updateChart(data, config, minValue, maxValue) {
    const checkboxes = document.querySelectorAll(
      `#${config.ledgerSelectId} input[type="checkbox"]:checked`
    );
    const selectedLedgers = Array.from(checkboxes).map(
      (checkbox) => checkbox.value
    );

    const filteredData = data.filter((entry) => {
      const snapshot_date = entry.snapshot_date.getTime(); // Get timeframe in milliseconds
      return snapshot_date >= minValue && snapshot_date <= maxValue;
    });

    const datasets = selectedLedgers.map((ledger) => ({
      label: ledger,
      data: filteredData.map((entry) => entry[ledger]),
      borderColor: colours[index % colours.length],
      backgroundColor: colours[index % colours.length],
      fill: false,
      hidden: false, // Show all datasets initially
    }));

    //console.log(`Slider: ${config.ledgerSelectId}`)
    renderLineChart(filteredData, config);
  }

  // Define a plugin to draw a text watermark on the chart
  const chart_watermark = {
    id: "chart_watermark",
    afterDraw: (chart) => {
      const image = new Image();
      const currentTheme = document.body.classList.contains("dark")
        ? "darkThemeBtn"
        : "lightThemeBtn";
      const watermarkSrc =
        currentTheme === "darkThemeBtn"
          ? "../edi-white.png"
          : "../edi-black.png";

      //image.src = "../edi-white.png";
      image.src = watermarkSrc;
      if (image.complete) {
        const image_height = 225; // Or you can use image.naturalHeight;
        const image_width = 400; // Or you can use image.naturalWidth;
        const ctx = chart.ctx;
        const x = chart.chartArea.left - (image_width - 400);
        const y = chart.chartArea.top + 1; // Adjust 30 for vertical positioning

        ctx.globalAlpha = 0.2;
        ctx.drawImage(image, x, y, image_width, image_height);
        ctx.globalAlpha = 1;
      } else {
        image.onload = () => chart.draw();
      }
    },
  };

  // Function to generate a random RGB color
  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  // Function to handle button clicks
  function handleButtonClick(buttonId) {
    // Perform specific actions based on the button clicked
    switch (buttonId) {
      case "button1":
        //alert('You clicked Button 1!');
        loadChartData(fileName);
        break;
      case "button2":
        //alert('You clicked Button 2!');
        loadChartData("output-absolute_5.csv");
        break;
      case "button3":
        //alert('You clicked Button 3!');
        loadChartData(fileName);
        break;
      default:
        console.log("Unknown button clicked.");
    }
  }

  // Initialize slider for date range selection
  function initializeSlider(data, config) {
    const dates = data.map((entry) => entry.snapshot_date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const minValue = minDate.getTime();
    const maxValue = maxDate.getTime();

    $(`#${config.sliderId}`).slider({
      range: true,
      min: minValue,
      max: maxValue,
      values: [minValue, maxValue],
      slide: function (event, ui) {
        const [startDate, endDate] = ui.values.map((value) => new Date(value));
        //console.log(`Selected date range for ${config.sliderId}:`, startDate, endDate);
        // Implement filtering or other actions based on selected date range
        config.onChange(data, config, startDate, endDate);
        updateChart(data, config, startDate, endDate);
        //renderChart(data, config);
      },
    });
  }

  function renderOneChart(data, config, index) {
    const dates = data.map((entry) => entry.snapshot_date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const minValue = minDate.getTime();
    const maxValue = maxDate.getTime();

    // Initialize ledger datasets for the current metric
    metric = config.metric;
    const ledgerDatasets = {};
    const canvasId = `${metric}`; // Unique canvas ID for each metric
    const ctx = document.getElementById(canvasId).getContext("2d");
    if (!ctx) {
      console.error(`Canvas context not found for ID: ${canvasId}`);
      return; // Skip rendering if canvas context is not found
    }

    if (charts[canvasId]) {
      // If chart instance already exists, destroy it before creating a new one
      //console.log(`Chart: ${charts[canvasId]}`);
      charts[canvasId].destroy();
    }

    // Iterate through data entries
    data.forEach((entry) => {
      const ledger = entry.ledger;

      // Ensure ledger dataset for the current metric is initialized
      if (!ledgerDatasets[ledger]) {
        const colorIndex = colours[index % colours.length];
        ledgerDatasets[ledger] = {
          label: ledger,
          data: [],
          borderColor: ledgerColorMap[ledger],
          backgroundColor: ledgerColorMap[ledger],
          fill: false,
        };
      }

      // Push data point (x: snapshot_date, y: metric value) to the ledger dataset
      ledgerDatasets[ledger].data.push({
        x: entry.snapshot_date,
        y: entry[metric],
      });
      //col = getRandomColor();
      //ledgerDatasets[ledger].borderColor = colours[colorIndex];
      //ledgerDatasets[ledger].backgroundColor = colours[colorIndex];
    });

    // Extract datasets for the current metric
    const datasets = Object.values(ledgerDatasets);

    const filteredData = data.filter((entry) => {
      const timeframe = entry.snapshot_date.getTime(); // Convert timeframe to milliseconds
      return timeframe >= minValue && timeframe <= maxValue;
    });

    const sortedData = data.sort(
      (a, b) => new Date(a.snapshot_date) - new Date(b.snapshot_date)
    );
    const labels = sortedData.map((entry) => entry.snapshot_date);

    // Determine chart options (e.g., title, axis labels) based on the metric
    const chartOptions = {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeInOutQuad",
          delay: (context) => {
            const index = context.dataIndex; // Get the index of the current data point
            return index * 10; // Delay each data point animation by 10 milliseconds
          },
        },
        plugins: {
          tooltip: {
            mode: "x",
            intersect: false,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            bodyColor: "white",
          },
          watermark: chart_watermark,
          legend: {
            labels: {
              color: "white",
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "year",
              parser: "YYYY-MM-DD",
              tooltipFormat: "ll",
              displayFormats: {
                year: "YYYY",
              },
            },
            ticks: {
              color: 'white',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: metric, // Use the metric as Y-axis title
            },
            //beginAtZero: true
            ticks: {
              color: 'white',
            },
          },
          
        },
      },
    };

    // Create and store a new chart instance for the current metric
    const chart = new Chart(ctx, chartOptions);
    Chart.register(chart_watermark);
    charts[canvasId] = chart;
  }

  loadChartData(fileName);

  $('#clustering_select').select2({
    theme: "bootstrap-5",
    placeholder: "Clustering",
    allowClear: false,
    //minimumResultsForSearch: -1,
    width: 'style',
    containerCssClass: "select2--small",
    selectionCssClass: "select2--small", // For Select2 v4.1
    //dropdownCssClass: "select2--small",
    dropdownParent: $("#clustering_select").parent(),
    minimumResultsForSearch: Infinity,
  });

  $('#clustering_select').val(['explorers', 'onchain']).trigger('change');

  // Function to get selected values
  function getSelectedValues() {
    var selectedValues = []; // Array to store selected values
    $('#clustering_select option:selected').each(function () {
      selectedValues.push($(this).val()); // Add selected value to array
    });
    return selectedValues;
  }

  $("#btnLoad").on("click", function () {
    clustering = getSelectedValues();
    console.log(`Clustering: ${clustering}`);

    if (clustering == 'explorers') {
      fileName = "output_explorers.csv"
    } else if (clustering == 'onchain') {
      fileName = "output_metadata.csv"
    } else if (clustering.join(',') == "explorers,onchain") {
      fileName = "output_clustered.csv"
    } else {
      fileName = "output_clustered.csv"
    }
    console.log(`FileName: ${fileName}`)

    full_path = "output/" + fileName;
    //console.log(`File loading: ${full_path}`);
    loadChartData(full_path);

  //  $("#toastMsg").text(`File: ${fileName} Loading...`);

//    toast = new bootstrap.Toast($("#liveToast"));
//    toast.show();
  });

  // Function to apply styles for the light theme
  function applyLightTheme() {
    $('.select2-results__option').css({
      'background-color': 'blue',
      'color': 'black'
    });
    // Iterate over each chart using for...in loop
    for (const key in charts) {
      if (charts.hasOwnProperty(key)) {
        const chart = charts[key];
        // Update chart options with light theme legend label color
        chart.options.plugins.legend.labels.color = 'black'; // Change legend font color to black
        // Access the scales object within the chart configuration
        const scales = chart.options.scales;

        // Iterate through each scale (x-axis and y-axis)
        Object.values(scales).forEach(scale => {
          // Set the color of the axis labels
          scale.ticks.color = 'black';
        });

        chart.update(); // Update the chart
      }
    }


  }

  // Function to apply styles for the dark theme
  function applyDarkTheme() {
    $('.select2-results__option').css({
      'background-color': 'blue',
      'color': 'black'
    });
    // Iterate over each chart using for...in loop
    for (const key in charts) {
      if (charts.hasOwnProperty(key)) {
        const chart = charts[key];
        // Update chart options with dark theme legend label color
        chart.options.plugins.legend.labels.color = 'white'; // Change legend font color to white
        // Access the scales object within the chart configuration
        const scales = chart.options.scales;

        // Iterate through each scale (x-axis and y-axis)
        Object.values(scales).forEach(scale => {
          // Set the color of the axis labels
          scale.ticks.color = 'white';
        });
        chart.update(); // Update the chart
      }
    }
  }

  function setTheme(mode = "dark") {
    const userMode = localStorage.getItem("bs-theme");
    const sysMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useSystem = mode === "system" || (!userMode && mode === "auto");
    const modeChosen = useSystem
      ? "system"
      : mode === "dark" || mode === "light"
        ? mode
        : userMode;

    if (modeChosen === "dark") {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      $('#mainLogo').attr('src', '../edi-white.png');
      $('#clustering_select').addClass('dark').removeClass('light');
      applyDarkTheme();

    } else if (modeChosen === "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      $('#mainLogo').attr('src', '../edi-black.png');
      $('#clustering_select').addClass('light').removeClass('dark');
      applyLightTheme();
    }

    if (useSystem) {
      localStorage.removeItem("bs-theme");
    } else {
      localStorage.setItem("bs-theme", modeChosen);
    }

    document.documentElement.setAttribute(
      "data-bs-theme",
      useSystem ? (sysMode ? "light" : "dark") : modeChosen
    );
    document
      .querySelectorAll(".mode-switch .btn")
      .forEach((e) => e.classList.remove("text-white"));
    document.getElementById(modeChosen).classList.add("text-white");
  }
  setTheme();
  document
    .querySelectorAll(".mode-switch .btn")
    .forEach((e) => e.addEventListener("click", () => setTheme(e.id)));
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", () => setTheme());
});
