


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Stall not found</title>
    <link rel="stylesheet" href="styles/home.css">
    <link rel="stylesheet" href="styles/styles.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <img class="logo-nav" src="media/images/login_logo.png" alt="Logo">
                <span class="header-text">404 Stall not Found</span>
            </div>
            <div class="menu">
                <span>STALLS</span>
                <span>ORDERS</span>
                <div class="user-icon">&#128100;</div>
            </div>
        </header>

        <main>
            <div class="org-header">
                <?php
                if ($orgRow) {
                    echo "<h1>Welcome to " . htmlspecialchars($orgRow['org_name']) . "</h1>";
                } else {
                    echo "<p>Select an organization to see its details.</p>";
                }
                ?>
            </div>

            <div class="org-selection">
                <form method="GET" action="">
                    <label for="org">Choose an Organization:</label>
                    <select name="org" id="org" onchange="this.form.submit()">
                        <option value="">-- Select Organization --</option>
                        <?php
                        if ($orgListResult->num_rows > 0) {
                            while ($row = $orgListResult->fetch_assoc()) {
                                $orgName = htmlspecialchars($row['org_name']);
                                echo "<option value='$orgName'" . ($selectedOrgName === $orgName ? ' selected' : '') . ">$orgName</option>";
                            }
                        }
                        ?>
                    </select>
                </form>
            </div>

            <div class="booth-cards">
                <?php
                if ($orgRow) {
                    $query = "
                    SELECT b.id, b.booth_name, b.location, b.schedule
                    FROM booths b
                    JOIN boothorg bo ON b.id = bo.booth_id
                    JOIN organizations o ON bo.org_id = o.id
                    WHERE o.org_name = ?
                    ";
                    $stmt = $con->prepare($query);
                    $stmt->bind_param("s", $selectedOrgName);
                    $stmt->execute();
                    $boothResult = $stmt->get_result();

                    if ($boothResult->num_rows > 0) {
                        while ($row = $boothResult->fetch_assoc()) {
                            echo "<div class='store-card'>
                                    <div class='booth-image'></div>
                                    <h2>" . htmlspecialchars($row['booth_name']) . "</h2>
                                    <p><strong>Location:</strong> " . htmlspecialchars($row['location']) . "</p>
                                    <p><strong>Schedule:</strong> " . htmlspecialchars($row['schedule']) . "</p>
                                    <button class='view-details-btn'>View Details</button>
                                  </div>";
                        }
                    } else {
                        echo "<p>No booths found for this organization.</p>";
                    }
                } else {
                    echo "<p>Select an organization to view its booths.</p>";
                }
                $con->close();
                ?>
            </div>
        </main>
    </div>
</body>
</html>
