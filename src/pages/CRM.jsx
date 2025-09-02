import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Spinner, Tabs, Tab } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUser, FaBusinessTime, FaBan, FaCheck, FaUserShield } from 'react-icons/fa';
import api from '../api/config';
import { toast } from 'react-toastify';

const CRM = () => {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, cardsResponse] = await Promise.all([
        api.get('/users'),
        api.get('/cards')
      ]);
      setUsers(usersResponse.data);
      setCards(cardsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch CRM data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, isActive) => {
    try {
      await api.put(`/users/${userId}/status`, { isActive });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive } : user
      ));
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      await api.post('/users/make-admin', { email: users.find(u => u._id === userId).email });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isAdmin: true } : user
      ));
      toast.success('User promoted to admin successfully');
    } catch (error) {
      toast.error('Failed to make user admin');
    }
  };

  const handleCardStatusChange = async (cardId, isActive) => {
    try {
      await api.put(`/cards/${cardId}/status`, { isActive });
      setCards(cards.map(card => 
        card._id === cardId ? { ...card, isActive } : card
      ));
      toast.success(`Card ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update card status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await api.delete(`/cards/${cardId}`);
        setCards(cards.filter(card => card._id !== cardId));
        toast.success('Card deleted successfully');
      } catch (error) {
        toast.error('Failed to delete card');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">CRM Dashboard</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="users" title="Users">
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.isAdmin ? (
                          <span className="text-primary">
                            <FaUserShield className="me-1" />
                            Admin
                          </span>
                        ) : user.isBusiness ? (
                          <span className="text-success">
                            <FaBusinessTime className="me-1" />
                            Business
                          </span>
                        ) : (
                          <span className="text-secondary">
                            <FaUser className="me-1" />
                            Regular
                          </span>
                        )}
                      </td>
                      <td>
                        {user.isActive ? (
                          <span className="text-success">Active</span>
                        ) : (
                          <span className="text-danger">Inactive</span>
                        )}
                      </td>
                      <td>
                        {!user.isAdmin && (
                          <Button
                            variant="link"
                            size="sm"
                            className="text-primary"
                            onClick={() => handleMakeAdmin(user._id)}
                            title="Make Admin"
                          >
                            <FaUserShield />
                          </Button>
                        )}
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleUserStatusChange(user._id, !user.isActive)}
                        >
                          {user.isActive ? <FaBan className="text-danger" /> : <FaCheck className="text-success" />}
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <FaTrash className="text-danger" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="cards" title="Business Cards">
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Business</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map(card => (
                    <tr key={card._id}>
                      <td>{card.title}</td>
                      <td>{card.businessName}</td>
                      <td>
                        {card.isActive ? (
                          <span className="text-success">Active</span>
                        ) : (
                          <span className="text-danger">Inactive</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleCardStatusChange(card._id, !card.isActive)}
                        >
                          {card.isActive ? <FaBan className="text-danger" /> : <FaCheck className="text-success" />}
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleDeleteCard(card._id)}
                        >
                          <FaTrash className="text-danger" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CRM; 