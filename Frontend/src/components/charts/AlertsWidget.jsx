import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Collapse,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Icon,
  Progress,
} from "@chakra-ui/react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const AlertsWidget = ({ alertsData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate totals
  const totalIncidents = alertsData?.length || 0;
  const incidentsWithAlerts = alertsData?.filter((alert) => alert.alerts);
  const totalAlerts = alertsData?.filter((alert) => alert.alerts).length || 0;
  const resolvedAlerts =
    alertsData?.filter((alert) => alert.resolved).length || 0;
  const unresolvedAlerts = totalAlerts - resolvedAlerts;

  // Count incidents by type and find the most frequent incident type
  const incidentCounts =
    incidentsWithAlerts?.reduce((acc, alert) => {
      acc[alert.incidentType] = (acc[alert.incidentType] || 0) + 1;
      return acc;
    }, {}) || {};

  const locationCounts = incidentsWithAlerts?.reduce((acc, alert) => {
    const location = alert.camera?.location || "Unknown Location";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const mostFrequentIncidentType = Object.entries(incidentCounts).reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["None", 0],
  );

  const solvedRatio = totalAlerts
    ? Math.round((resolvedAlerts / totalAlerts) * 100)
    : 0;

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Box p="6" boxShadow="lg" bg="gray.800" color="gray.100">
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Text fontSize="2xl" fontWeight="bold" color="teal.400">
          Alerts Analytics
        </Text>
        <Button
          onClick={toggleExpand}
          rightIcon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          variant="solid"
          size="md"
          colorScheme="teal"
          bg="teal.600"
          _hover={{ bg: "teal.700" }}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </Flex>

      {/* Summary Stats */}
      <StatGroup>
        <Stat>
          <StatLabel fontSize="lg" color="gray.400">
            Total Incidents
          </StatLabel>
          <StatNumber fontSize="2xl" color="teal.300">
            <Flex alignItems="center" gap={2}>
              <Icon as={FaExclamationCircle} mr="2" />
              {totalIncidents}
            </Flex>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="lg" color="gray.400">
            Total Alerts
          </StatLabel>
          <StatNumber fontSize="2xl" color="teal.300">
            <Flex alignItems="center" gap={2}>
              <Icon as={FaExclamationCircle} mr="2" />
              {totalAlerts}
            </Flex>
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="lg" color="gray.400">
            Solved to Unsolved Ratio
          </StatLabel>
          <StatNumber fontSize="2xl" color="green.400">
            <Flex alignItems="center" gap={2}>
              <Icon as={FaCheckCircle} mr="2" />
              {`${solvedRatio}%`}
            </Flex>
            <Progress
              mt={2}
              value={solvedRatio}
              size="sm"
              colorScheme="green"
            />
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="lg" color="gray.400">
            Most Frequent Incident Type
          </StatLabel>
          <StatNumber fontSize="2xl" color="red.400">
            {mostFrequentIncidentType[0]} ({mostFrequentIncidentType[1]} alerts)
          </StatNumber>
        </Stat>
      </StatGroup>

      {/* Incident-wise Breakdown */}
      <Collapse in={isExpanded} animateOpacity>
        <Box
          mt="6"
          p="4"
          borderWidth="1px"
          borderRadius="md"
          bg="gray.700"
          boxShadow="md"
        >
          <Text fontWeight="bold" mb="2" fontSize="lg" color="teal.400">
            Incident-wise Alerts Breakdown
          </Text>
          {Object.entries(incidentCounts).map(([incidentType, count]) => (
            <Flex key={incidentType} justifyContent="space-between" py="1">
              <Text>{incidentType}</Text>
              <Text>{count}</Text>
            </Flex>
          ))}

          {/* Location-Based Breakdown */}
          <Box mt="4">
            <Text fontWeight="bold" mb="2" fontSize="lg" color="teal.400">
              Location-Based Alerts
            </Text>
            {Object.entries(locationCounts).map(([location, count]) => (
              <Flex key={location} justifyContent="space-between" py="1">
                <Text>{location}</Text>
                <Text>{count}</Text>
              </Flex>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AlertsWidget;
