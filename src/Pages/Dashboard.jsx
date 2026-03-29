import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiGift,
  FiHeart,
  FiCreditCard,
  FiFileText,
  FiBriefcase,
  FiCalendar,
  FiDollarSign
} from "react-icons/fi";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  ListGroup,
  ListGroupItem,
  Spinner,
  Badge,
  Progress
} from "reactstrap";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false since we're using dummy data

  // Dummy data - Replace with actual API data when available
  useEffect(() => {
    // Simulating data fetch
    const loadDummyData = () => {
      const dummyData = {
        // Main Stats
        totalBillBooks: 245,
        totalVisitingCards: 178,
        totalBookings: 89,
        totalRevenue: 1254500,
        revenueChange: "+15.2%",
        
        // Users & Subscriptions
        totalUsersCount: 1560,
        activeUsersCount: 1245,
        totalActiveSubscriptions: 890,
        
        // Content Stats
        totalPosters: 345,
        totalCategories: 28,
        totalBanners: 45,
        totalLogos: 67,
        
        // Special Days
        birthdayUsers: [
          { _id: "1", name: "Rajesh Kumar", dob: "1990-05-15" },
          { _id: "2", name: "Priya Sharma", dob: "1985-05-15" }
        ],
        anniversaryUsers: [
          { _id: "3", name: "Amit Patel", marriageAnniversaryDate: "2010-05-15" },
          { _id: "4", name: "Neha Gupta", marriageAnniversaryDate: "2015-05-15" }
        ],
        
        // Plan Summary
        planSummary: {
          "Basic": 450,
          "Pro": 320,
          "Premium": 120
        },
        
        // Recent Bookings
        recentBookings: [
          { id: 1, customer: "Sunil Traders", amount: "₹12,500", status: "Confirmed", date: "2026-01-15" },
          { id: 2, customer: "Mohan Enterprises", amount: "₹8,300", status: "Pending", date: "2026-01-14" },
          { id: 3, customer: "Ravi Industries", amount: "₹25,000", status: "Delivered", date: "2026-01-13" },
          { id: 4, customer: "Kumar Pvt Ltd", amount: "₹15,750", status: "Confirmed", date: "2026-01-12" }
        ],
        
        // Bill Book Types
        billBookTypes: [
          { type: "Offset Printing", count: 120, color: "#3B82F6" },
          { type: "Flex Printing", count: 85, color: "#10B981" },
          { type: "Physical Card", count: 25, color: "#F59E0B" },
          { type: "Multicolor", count: 15, color: "#8B5CF6" }
        ],
        
        // Revenue Stats
        monthlyRevenue: [
          { month: "Jan", revenue: 980000 },
          { month: "Feb", revenue: 1100000 },
          { month: "Mar", revenue: 890000 },
          { month: "Apr", revenue: 1250000 },
          { month: "May", revenue: 1050000 },
          { month: "Jun", revenue: 1350000 }
        ],
        
        // Visiting Card Stats
        visitingCardStats: {
          digital: 120,
          printed: 58,
          pending: 25
        }
      };
      
      setDashboardData(dummyData);
      setLoading(false);
    };

    // Simulate API call delay
    setLoading(true);
    setTimeout(() => {
      loadDummyData();
    }, 800);
  }, []);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner color="primary" />
        <p>Loading dashboard...</p>
      </div>
    );

  if (!dashboardData)
    return (
      <div className="text-center my-5 text-danger">
        Failed to load data
      </div>
    );

  const {
    totalBillBooks,
    totalVisitingCards,
    totalBookings,
    totalRevenue,
    revenueChange,
    totalUsersCount,
    totalPosters,
    totalCategories,
    totalBanners,
    totalLogos,
    totalActiveSubscriptions,
    activeUsersCount,
    birthdayUsers,
    anniversaryUsers,
    planSummary,
    recentBookings,
    billBookTypes,
    monthlyRevenue,
    visitingCardStats
  } = dashboardData;

  // Main Stats Cards
  const mainStats = [
    { 
      label: "Total Bill Books", 
      value: totalBillBooks, 
      bg: "#E0F2FE", 
      color: "#0284C7",
      icon: <FiFileText size={24} />,
      description: "All printed bill books"
    },
    { 
      label: "Visiting Cards", 
      value: totalVisitingCards, 
      bg: "#EDE9FE", 
      color: "#7C3AED",
      icon: <FiBriefcase size={24} />,
      description: "Digital & Printed cards"
    },
    { 
      label: "Total Bookings", 
      value: totalBookings, 
      bg: "#FCE7F3", 
      color: "#BE185D",
      icon: <FiCalendar size={24} />,
      description: "All orders placed"
    },
    { 
      label: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      bg: "#D1FAE5", 
      color: "#059669",
      icon: <FiDollarSign size={24} />,
      description: `Monthly change: ${revenueChange}`,
      trend: "up"
    },
  ];

  // Secondary Stats
  const secondaryStats = [
    { label: "Total Users", value: totalUsersCount, bg: "#FEF2F2", color: "#DC2626" },
    { label: "Active Users", value: activeUsersCount, bg: "#FEF9C3", color: "#CA8A04" },
    { label: "Total Posters", value: totalPosters, bg: "#E0E7FF", color: "#4338CA" },
    { label: "Active Subscriptions", value: totalActiveSubscriptions, bg: "#FEF2F2", color: "#EF4444" },
    { label: "Categories", value: totalCategories, bg: "#FCE7F3", color: "#BE185D" },
    { label: "Banners", value: totalBanners, bg: "#E0F2FE", color: "#0EA5E9" },
    { label: "Logos", value: totalLogos, bg: "#EDE9FE", color: "#8B5CF6" },
  ];

  return (
    <Container fluid className="my-4 px-4">
      <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
      
      {/* MAIN STATS - Top Row */}
      <Row className="mb-4">
        {mainStats.map((stat, index) => (
          <Col xs="12" sm="6" lg="3" key={index} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <CardBody className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <CardTitle tag="h6" className="mb-1 text-muted">
                      {stat.label}
                    </CardTitle>
                    <h2 className="fw-bold mb-0" style={{ color: stat.color }}>
                      {stat.value}
                    </h2>
                    {stat.trend === "up" && (
                      <small className="text-success fw-bold">{stat.description}</small>
                    )}
                    {!stat.trend && (
                      <small className="text-muted">{stat.description}</small>
                    )}
                  </div>
                  <div style={{ 
                    backgroundColor: `${stat.color}20`,
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* SECONDARY STATS */}
      <Row className="mb-4">
        <Col xs="12">
          <Card className="shadow-sm border-0">
            <CardBody>
              <CardTitle tag="h5" className="mb-3">Quick Stats</CardTitle>
              <Row>
                {secondaryStats.map((stat, index) => (
                  <Col xs="6" sm="4" md="3" lg="2" key={index} className="mb-3">
                    <div className="text-center p-3 rounded" style={{ backgroundColor: stat.bg }}>
                      <h6 className="mb-1" style={{ color: stat.color }}>{stat.label}</h6>
                      <h4 className="fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</h4>
                    </div>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* BILL BOOKS & VISITING CARDS DETAILS */}
      <Row className="mb-4">
        {/* Bill Book Types */}
        <Col lg="6" className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <FiFileText size={24} className="text-primary me-2" />
                <h5 className="mb-0 fw-bold">Bill Book Types</h5>
              </div>
              {billBookTypes.map((type, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{type.type}</span>
                    <span className="fw-bold">{type.count}</span>
                  </div>
                  <Progress 
                    value={(type.count / totalBillBooks) * 100}
                    style={{ height: '8px', backgroundColor: '#f1f1f1' }}
                  >
                    <Progress bar style={{ backgroundColor: type.color }} />
                  </Progress>
                </div>
              ))}
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total Bill Books</span>
                  <span className="fw-bold text-primary">{totalBillBooks}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Visiting Cards Stats */}
        <Col lg="6" className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <FiBriefcase size={24} className="text-purple me-2" />
                <h5 className="mb-0 fw-bold">Visiting Cards Status</h5>
              </div>
              <Row>
                <Col xs="4" className="text-center mb-3">
                  <div className="p-3 rounded" style={{ backgroundColor: '#E0F2FE' }}>
                    <h3 className="fw-bold text-primary">{visitingCardStats.digital}</h3>
                    <small className="text-muted">Digital</small>
                  </div>
                </Col>
                <Col xs="4" className="text-center mb-3">
                  <div className="p-3 rounded" style={{ backgroundColor: '#D1FAE5' }}>
                    <h3 className="fw-bold text-success">{visitingCardStats.printed}</h3>
                    <small className="text-muted">Printed</small>
                  </div>
                </Col>
                <Col xs="4" className="text-center mb-3">
                  <div className="p-3 rounded" style={{ backgroundColor: '#FEF3C7' }}>
                    <h3 className="fw-bold text-warning">{visitingCardStats.pending}</h3>
                    <small className="text-muted">Pending</small>
                  </div>
                </Col>
              </Row>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Visiting Cards</span>
                  <span className="fw-bold">{totalVisitingCards}</span>
                </div>
                <Progress 
                  multi
                  style={{ height: '10px' }}
                >
                  <Progress 
                    bar 
                    value={(visitingCardStats.digital / totalVisitingCards) * 100}
                    color="primary"
                  />
                  <Progress 
                    bar 
                    value={(visitingCardStats.printed / totalVisitingCards) * 100}
                    color="success"
                  />
                  <Progress 
                    bar 
                    value={(visitingCardStats.pending / totalVisitingCards) * 100}
                    color="warning"
                  />
                </Progress>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* RECENT BOOKINGS & REVENUE CHART */}
      <Row className="mb-4">
        {/* Recent Bookings */}
        <Col lg="6" className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <FiCalendar size={24} className="text-danger me-2" />
                  <h5 className="mb-0 fw-bold">Recent Bookings</h5>
                </div>
                <Badge color="primary" pill>Latest</Badge>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-muted">No recent bookings.</p>
              ) : (
                <ListGroup flush>
                  {recentBookings.map((booking) => (
                    <ListGroupItem key={booking.id} className="px-0 py-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{booking.customer}</h6>
                          <small className="text-muted">{booking.date}</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">{booking.amount}</div>
                          <Badge 
                            color={
                              booking.status === 'Confirmed' ? 'success' : 
                              booking.status === 'Pending' ? 'warning' : 'info'
                            }
                            pill
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
              <div className="text-center mt-3">
                <small className="text-primary">View All Bookings →</small>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Revenue Overview */}
        <Col lg="6" className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <FiDollarSign size={24} className="text-success me-2" />
                <h5 className="mb-0 fw-bold">Revenue Overview (Last 6 Months)</h5>
              </div>
              <div className="mb-4">
                <h2 className="fw-bold text-success">₹{totalRevenue.toLocaleString()}</h2>
                <small className="text-success fw-bold">
                  <i className="fas fa-arrow-up"></i> {revenueChange} from last month
                </small>
              </div>
              <div style={{ height: '200px' }}>
                {monthlyRevenue.map((monthData, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{monthData.month}</span>
                      <span className="fw-bold">₹{(monthData.revenue/1000).toFixed(0)}K</span>
                    </div>
                    <Progress 
                      value={(monthData.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}
                      style={{ height: '10px' }}
                      color="success"
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* BIRTHDAYS + ANNIVERSARIES + PLANS */}
      <Row>
        <Col md="4" className="mb-3">
          <Card className="shadow-sm border-0 h-100">
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <FiGift size={24} className="text-pink-600 bg-pink-100 rounded p-2 me-2" />
                <h5 className="mb-0 fw-bold">Today's Birthdays</h5>
              </div>
              {birthdayUsers.length === 0 ? (
                <p className="text-muted">No birthdays today.</p>
              ) : (
                birthdayUsers.map((user, i) => (
                  <div key={user._id || i} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <div>
                      <strong>{user.name}</strong>
                      <div className="small text-muted">{user.dob}</div>
                    </div>
                    <Badge color="danger" pill>🎂</Badge>
                  </div>
                ))
              )}
              <div className="text-center mt-3">
                <small className="text-primary">Send Birthday Wishes →</small>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="4" className="mb-3">
          <Card className="shadow-sm border-0 h-100">
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <FiHeart size={24} className="text-danger bg-danger bg-opacity-10 rounded p-2 me-2" />
                <h5 className="mb-0 fw-bold">Anniversaries</h5>
              </div>
              {anniversaryUsers.length === 0 ? (
                <p className="text-muted">No anniversaries today.</p>
              ) : (
                anniversaryUsers.map((user, i) => (
                  <div key={user._id || i} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <div>
                      <strong>{user.name}</strong>
                      <div className="small text-muted">{user.marriageAnniversaryDate}</div>
                    </div>
                    <Badge color="danger" pill>💝</Badge>
                  </div>
                ))
              )}
              <div className="text-center mt-3">
                <small className="text-primary">Send Anniversary Wishes →</small>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="4" className="mb-3">
          <Card className="shadow-sm border-0 h-100">
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <FiCreditCard size={24} className="text-success bg-success bg-opacity-10 rounded p-2 me-2" />
                <h5 className="mb-0 fw-bold">Subscription Plans</h5>
              </div>
              {Object.keys(planSummary).length === 0 ? (
                <p className="text-muted">No active subscriptions.</p>
              ) : (
                <>
                  <ListGroup flush>
                    {Object.entries(planSummary).map(([plan, count], i) => (
                      <ListGroupItem key={i} className="d-flex justify-content-between align-items-center px-0 py-2">
                        <span className="fw-bold">{plan}</span>
                        <div>
                          <Badge color="primary" pill>{count} Users</Badge>
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Total Subscribers</span>
                      <span className="fw-bold text-primary">{totalActiveSubscriptions}</span>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* SUMMARY FOOTER */}
      <Row className="mt-4">
        <Col xs="12">
          <Card className="shadow-sm border-0 bg-light">
            <CardBody className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Dashboard Summary</h6>
                  <small className="text-muted">Last updated: Just now</small>
                </div>
                <div className="text-end">
                  <div className="d-flex gap-3">
                    <div className="text-center">
                      <div className="fw-bold">{totalBookings}</div>
                      <small className="text-muted">Bookings Today</small>
                    </div>
                    <div className="text-center">
                      <div className="fw-bold text-success">₹{Math.round(totalRevenue/30).toLocaleString()}</div>
                      <small className="text-muted">Avg Daily Revenue</small>
                    </div>
                    <div className="text-center">
                      <div className="fw-bold">{totalVisitingCards}</div>
                      <small className="text-muted">Cards This Month</small>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;