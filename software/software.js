// jQuery document ready function to ensure the DOM is fully loaded
$(document).ready(function () {
  // Define chart configurations
  const chartConfigs = [
    {
      metric: "entropy",
      containerId: "chart-container-1",
      repoSelectId: "repo-select-1",
      sliderId: "timeframe-slider-1",
      onChange: (data, config, minValue, maxValue) => {
        updateChart(data, config, minValue, maxValue);
      },
    },

    {
      metric: "hhi",
      containerId: "chart-container-2",
      repoSelectId: "repo-select-2",
      sliderId: "timeframe-slider-2",
      onChange: (data, config, minValue, maxValue) => {
        updateChart(data, config, minValue, maxValue);
      },
    },

    {
      metric: "theil_index",
      containerId: "chart-container-3",
      repoSelectId: "repo-select-3",
      sliderId: "timeframe-slider-3",
      onChange: (data, config, minValue, maxValue) => {
        updateChart(data, config, minValue, maxValue);
      },
    },
    {
      metric: "max_power_ratio",
      containerId: "chart-container-4",
      repoSelectId: "repo-select-4",
      sliderId: "timeframe-slider-4",
      onChange: (data, config, minValue, maxValue) => {
        updateChart(data, config, minValue, maxValue);
      },
    },
    {
      metric: "total_entities",
      containerId: "chart-container-5",
      repoSelectId: "repo-select-5",
      sliderId: "timeframe-slider-5",
      onChange: (data, config, minValue, maxValue) => {
        updateChart(data, config, minValue, maxValue);
      },
    },
  ];

  const valueColumns = [
    "entropy",
    "hhi",
    "theil_index",
    "max_power_ratio",
    "total_entities",
  ];

  // Define repo names in the desired order
  const repoNames = [
    "bitcoin",
    "bitcoin-cash-node",
    "cardano-node",
    "go-ethereum",
    "nethermind",
    "litecoin",
    "polkadot-sdk",
    "solana",
    "tezos-mirror",
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
    "rgba(137, 10, 109, 1)",
    "rgba(114, 82, 49, 1)",
  ];

  // Create a repo-to-color mapping using the colours array
  const repoColorMap = {};
  repoNames.forEach((repo, index) => {
    repoColorMap[repo] = colours[index % colours.length]; // Use modulo to cycle through colours
  });

  // Store references to chart instances
  const charts = {};

  let fileName =
    "output/for_line_charts/all_metrics_by_lines_changed_per_author_per_100_commits.csv";

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

  // Function to parse the date from 'MMM-YYYY' format
  const parseExtendDate = (dateString) => {
    // Split the date string by '-'
    const [year, month, day] = dateString.split("-");
    // Convert month name to a number (e.g., 'Jan' to 0, 'Feb' to 1, etc.)
    //const monthNumber = moment().month(month).format("M") - 1;
    // Create a new Date object with the year and month (day defaults to 1)
    return new Date(year, month - 1, day);
  };

  // Parse CSV data into structured format
  function parseCSV(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      //const entry = {};

      if (values.length === headers.length) {
        const entry = {};
        headers.forEach((header, index) => {
          //console.log('Header: ', valueColumns.includes(header.trim()));
          const value = values[index].trim();
          if (header.trim() === "date") {
            entry[header.trim()] = parseExtendDate(value);
          } else if (header.trim() === "repo") {
            entry[header.trim()] = value; // Store repo name
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
    const dates = data.map((entry) => entry.date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const minValue = minDate.getTime();
    const maxValue = maxDate.getTime();

    const checkboxes = document.querySelectorAll(
      `#${config.repoSelectId} input[type="checkbox"]`
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
      `#${config.repoSelectId} input[type="checkbox"]:checked`
    );
    const selectedRepos = Array.from(checkboxes).map(
      (checkbox) => checkbox.value
    );

    const filteredData = data.filter((entry) => {
      const snapshot_date = entry.date.getTime(); // Get timeframe in milliseconds
      return snapshot_date >= minValue && snapshot_date <= maxValue;
    });

    const datasets = selectedRepos.map((repo) => ({
      label: repo,
      data: filteredData.map((entry) => entry[repo]),
      borderColor: colours[index % colours.length],
      backgroundColor: colours[index % colours.length],
      fill: false,
      hidden: false, // Show all datasets initially
    }));

    //console.log(`Slider: ${config.repoSelectId}`)
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
    const dates = data.map((entry) => entry.date);
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
    const dates = data.map((entry) => entry.date);
    //console.log('Dates: ', dates)
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const minValue = minDate.getTime();
    const maxValue = maxDate.getTime();

    //console.log('minDate: ', minDate, ' maxDate: ', maxDate)

    // Initialize repo datasets for the current metric
    metric = config.metric;
    const repoDatasets = {};
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
      const repo = entry.repo;

      // Ensure repo dataset for the current metric is initialized
      if (!repoDatasets[repo]) {
        const colorIndex = colours[index % colours.length];
        repoDatasets[repo] = {
          label: repo,
          data: [],
          borderColor: repoColorMap[repo],
          backgroundColor: repoColorMap[repo],
          fill: false,
        };
      }

      // Push data point (x: snapshot_date, y: metric value) to the repo dataset
      repoDatasets[repo].data.push({
        x: entry.date,
        y: entry[metric],
      });
      //col = getRandomColor();
      //repoDatasets[repo].borderColor = colours[colorIndex];
      //repoDatasets[repo].backgroundColor = colours[colorIndex];
    });

    // Extract datasets for the current metric
    const datasets = Object.values(repoDatasets);

    const filteredData = data.filter((entry) => {
      const timeframe = entry.date.getTime(); // Convert timeframe to milliseconds
      return timeframe >= minValue && timeframe <= maxValue;
    });

    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedData.map((entry) => entry.date);

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
              color: "white",
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
              color: "white",
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

  $("#clustering_select").select2({
    theme: "bootstrap-5",
    placeholder: "Clustering",
    allowClear: false,
    //minimumResultsForSearch: -1,
    width: "style",
    containerCssClass: "select2--small",
    selectionCssClass: "select2--small", // For Select2 v4.1
    //dropdownCssClass: "select2--small",
    dropdownParent: $("#clustering_select").parent(),
    minimumResultsForSearch: Infinity,
  });

  $("#clustering_select").val(["explorers", "onchain"]).trigger("change");

  // Function to get selected values
  function getSelectedValues() {
    var selectedValues = []; // Array to store selected values
    $("#clustering_select option:selected").each(function () {
      selectedValues.push($(this).val()); // Add selected value to array
    });
    return selectedValues;
  }

  $("#btnLoad").on("click", function () {
    clustering = getSelectedValues();
    console.log(`Clustering: ${clustering}`);

    if (clustering == "explorers") {
      fileName = "output_explorers.csv";
    } else if (clustering == "onchain") {
      fileName = "output_metadata.csv";
    } else if (clustering.join(",") == "explorers,onchain") {
      fileName = "output_clustered.csv";
    } else {
      fileName = "output_clustered.csv";
    }
    console.log(`FileName: ${fileName}`);

    full_path = "output/" + fileName;
    //console.log(`File loading: ${full_path}`);
    loadChartData(full_path);

    //  $("#toastMsg").text(`File: ${fileName} Loading...`);
  });

  // Function to apply styles for the light theme
  function applyLightTheme() {
    $(".select2-results__option").css({
      "background-color": "blue",
      color: "black",
    });
    // Iterate over each chart using for...in loop
    for (const key in charts) {
      if (charts.hasOwnProperty(key)) {
        const chart = charts[key];
        // Update chart options with light theme legend label color
        chart.options.plugins.legend.labels.color = "black"; // Change legend font color to black
        // Access the scales object within the chart configuration
        const scales = chart.options.scales;

        // Iterate through each scale (x-axis and y-axis)
        Object.values(scales).forEach((scale) => {
          // Set the color of the axis labels
          scale.ticks.color = "black";
        });

        chart.update(); // Update the chart
      }
    }
  }

  // Function to apply styles for the dark theme
  function applyDarkTheme() {
    $(".select2-results__option").css({
      "background-color": "blue",
      color: "black",
    });
    // Iterate over each chart using for...in loop
    for (const key in charts) {
      if (charts.hasOwnProperty(key)) {
        const chart = charts[key];
        // Update chart options with dark theme legend label color
        chart.options.plugins.legend.labels.color = "white"; // Change legend font color to white
        // Access the scales object within the chart configuration
        const scales = chart.options.scales;

        // Iterate through each scale (x-axis and y-axis)
        Object.values(scales).forEach((scale) => {
          // Set the color of the axis labels
          scale.ticks.color = "white";
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
      $("#mainLogo").attr("src", "../edi-white.png");
      $("#clustering_select").addClass("dark").removeClass("light");
      applyDarkTheme();
    } else if (modeChosen === "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      $("#mainLogo").attr("src", "../edi-black.png");
      $("#clustering_select").addClass("light").removeClass("dark");
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

  const doughnutFileName =
    "output/for_dougnut_charts/by_lines_changed_per_author/bitcoin_commits_per_entity.csv";

  const doughnutCharts = [
    "bitcoin",
    "bitcoin_cash",
    "cardano",
    "go-ethereum",
    "litecoin",
    "nethermind",
    "polkadot-sdk",
    "solana",
    "tezos",
    "zcash",
  ];

  function loadDoughnutChartData(fileName) {
    fetch(fileName)
      .then((response) => response.text())
      .then((csvData) => {
        const authors = parseDoughnutData(csvData);

        //doughnutCharts.forEach((dougnut) => {
        renderDougnutChart("doughnut_bitcoin", authors);
        //});
      })
      .catch((error) => {
        console.error(`Error loading data for ${fileName}:`, error);
      });
  }

  function parseDoughnutData(data) {
    const lines = data.trim().split("\n");
    const authors = [];

    lines.forEach((line) => {
      const [label, value] = line.split(",");
      authors.push({ label, value: Number(value) });
    });

    return authors;
  }

  function renderDougnutChart(doughnut, authors) {
    // Get the top 10 authors
    //const topAuthors = getTopAuthors(authors, 10);

    // Get the authors based upon percentages
    const topAuthors = getTopAuthorsByPercentage(authors, 20);
    // Extract labels and values for the chart
    const labels = topAuthors.map((author) => author.label);
    const values = topAuthors.map((author) => author.value);

    // Generate random colors for the chart
    const backgroundColors = values.map(() => getRandomColor(0.2));
    const borderColors = values.map(() => getRandomColor(1));

    const canvasId = `${doughnut}`; // Unique canvas ID for each metric
    const ctx = document.getElementById(canvasId).getContext("2d");
    if (!ctx) {
      console.error(`Canvas context not found for ID: ${canvasId}`);
      return; // Skip rendering if canvas context is not found
    }

    // Determine chart options (e.g., title, axis labels) based on the metric
    const doughnutChartOptions = {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "# of Commits",
            data: values,
            backgroundColor: backgroundColors,
            //borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeInOutQuad",
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw || 0;
                return `${label}: ${value} commits`;
              },
            },
          },
          watermark: chart_watermark,
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Top authors by commit percentage",
          },
        },
      },
    };

    // Create and store a new chart instance for the current metric
    const doughnut_chart = new Chart(ctx, doughnutChartOptions);
    Chart.register(chart_watermark);
  }

  // Function to get the top N authors
  const getTopAuthors = (authors, topN) => {
    // Sort authors by the number of commits in descending order
    authors.sort((a, b) => b.value - a.value);

    // Get the top N authors
    const topAuthors = authors.slice(0, topN);

    // Get the remaining authors
    const otherAuthors = authors.slice(topN);

    // Calculate total commits for percentage calculation
    const totalCommits = topAuthors.reduce(
      (sum, author) => sum + author.value,
      0
    );

    // Calculate percentages and format labels
    topAuthors.forEach((author) => {
      author.percentage = ((author.value / totalCommits) * 100).toFixed(2);
      author.label = `${author.label} (${author.percentage}%)`;
    });

    // Calculate the total commits and percentage for "Others"
    const othersValue = otherAuthors.reduce(
      (sum, author) => sum + author.value,
      0
    );
    const othersPercentage = ((othersValue / totalCommits) * 100).toFixed(2);

    // Add "Others" to the top authors
    topAuthors.push({
      label: `Others (${othersPercentage}%)`,
      value: othersValue,
    });

    return topAuthors;
  };

  // Function to get the top authors by percentage and group the rest as "Others"
  const getTopAuthorsByPercentage = (authors, topN) => {
    // Calculate total commits for percentage calculation
    const totalCommits = authors.reduce((sum, author) => sum + author.value, 0);

    // Calculate percentages for each author
    authors.forEach((author) => {
      author.percentage = ((author.value / totalCommits) * 100).toFixed(2);
    });

    // Sort authors by their percentage in descending order
    authors.sort((a, b) => b.percentage - a.percentage);

    // Get the top N authors by percentage
    const topAuthors = authors.slice(0, topN);

    // Get the remaining authors
    const otherAuthors = authors.slice(topN);

    // Calculate the total commits and percentage for "Others"
    const othersValue = otherAuthors.reduce(
      (sum, author) => sum + author.value,
      0
    );
    const othersPercentage = ((othersValue / totalCommits) * 100).toFixed(2);

    // Add "Others" to the top authors
    topAuthors.push({
      label: `Others (${othersPercentage}%)`,
      value: othersValue,
      percentage: othersPercentage,
    });

    // Format labels to include percentages
    topAuthors.forEach((author) => {
      author.label = `${author.label} (${author.percentage}%)`;
    });

    return topAuthors;
  };

  // Function to generate a random RGB color
  function getRandomColor(opacity) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  loadDoughnutChartData(doughnutFileName);
});
