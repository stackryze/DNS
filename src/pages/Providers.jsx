import React, { useState, useEffect } from 'react';
import { FaAws, FaCloudflare, FaDigitalOcean, FaPlus, FaTrash, FaCheck, FaTimes, FaSync } from 'react-icons/fa';
import { useToast } from '../components/Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const PROVIDER_INFO = {
  'aws-route53': {
    name: 'AWS Route53',
    icon: FaAws,
    color: '#FF9900',
    fields: [
      { name: 'accessKeyId', label: 'Access Key ID', type: 'text', required: true },
      { name: 'secretAccessKey', label: 'Secret Access Key', type: 'password', required: true },
      { name: 'region', label: 'Region', type: 'text', default: 'us-east-1', required: false }
    ]
  },
  'cloudflare': {
    name: 'Cloudflare',
    icon: FaCloudflare,
    color: '#F38020',
    fields: [
      { name: 'apiToken', label: 'API Token', type: 'password', required: true, 
        hint: 'Generate at: https://dash.cloudflare.com/profile/api-tokens' }
    ]
  },
  'digitalocean': {
    name: 'DigitalOcean',
    icon: FaDigitalOcean,
    color: '#0080FF',
    fields: [
      { name: 'apiToken', label: 'API Token', type: 'password', required: true,
        hint: 'Generate at: https://cloud.digitalocean.com/account/api/tokens' }
    ]
  }
};

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [formData, setFormData] = useState({});
  const [connectionName, setConnectionName] = useState('');
  const [connecting, setConnecting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/providers`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error('Fetch providers error:', error);
      showToast('Failed to load providers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProvider = (providerType) => {
    setSelectedProvider(providerType);
    setFormData({});
    setConnectionName(PROVIDER_INFO[providerType].name);
    setShowAddModal(true);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setConnecting(true);

    try {
      const response = await fetch(`${API_URL}/api/providers/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          provider: selectedProvider,
          name: connectionName,
          credentials: formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Provider connected successfully!', 'success');
        setShowAddModal(false);
        fetchProviders();
      } else {
        showToast(data.message || 'Failed to connect provider', 'error');
      }
    } catch (error) {
      console.error('Connect provider error:', error);
      showToast('Failed to connect provider', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (providerId, providerName) => {
    if (!confirm(`Are you sure you want to disconnect ${providerName}?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/providers/${providerId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        showToast('Provider disconnected', 'success');
        fetchProviders();
      } else {
        showToast('Failed to disconnect provider', 'error');
      }
    } catch (error) {
      console.error('Disconnect provider error:', error);
      showToast('Failed to disconnect provider', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <FaCheck className="text-green-500" />;
      case 'error':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaSync className="text-gray-400 animate-spin" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSync className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cloud Providers</h1>
        <p className="text-gray-600">Connect your DNS providers to manage all zones in one place</p>
      </div>

      {/* Connected Providers */}
      {providers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Connected Providers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {providers.map((provider) => {
              const ProviderIcon = PROVIDER_INFO[provider.provider]?.icon || FaCloudflare;
              const providerColor = PROVIDER_INFO[provider.provider]?.color || '#666';

              return (
                <div key={provider._id} className="bg-white rounded-lg shadow-md p-6 border-l-4" 
                     style={{ borderColor: providerColor }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ProviderIcon className="text-3xl" style={{ color: providerColor }} />
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-gray-500">{PROVIDER_INFO[provider.provider]?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(provider.status)}
                      <button
                        onClick={() => handleDisconnect(provider._id, provider.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {provider.metadata && (
                    <div className="text-sm text-gray-600">
                      {provider.metadata.zoneCount !== undefined && (
                        <p>Zones: {provider.metadata.zoneCount}</p>
                      )}
                      {provider.lastSyncedAt && (
                        <p>Last synced: {new Date(provider.lastSyncedAt).toLocaleString()}</p>
                      )}
                    </div>
                  )}

                  {provider.status === 'error' && provider.errorMessage && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      {provider.errorMessage}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Provider */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Add Provider</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(PROVIDER_INFO).map(([key, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={key}
                onClick={() => handleAddProvider(key)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              >
                <Icon className="text-5xl mb-4 mx-auto" style={{ color: info.color }} />
                <h3 className="font-semibold text-lg mb-2">{info.name}</h3>
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <FaPlus />
                  <span>Connect</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Provider Modal */}
      {showAddModal && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              {React.createElement(PROVIDER_INFO[selectedProvider].icon, {
                className: "text-4xl",
                style: { color: PROVIDER_INFO[selectedProvider].color }
              })}
              <h2 className="text-2xl font-bold">Connect {PROVIDER_INFO[selectedProvider].name}</h2>
            </div>

            <form onSubmit={handleConnect}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Connection Name</label>
                <input
                  type="text"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Production AWS"
                  required
                />
              </div>

              {PROVIDER_INFO[selectedProvider].fields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    value={formData[field.name] || field.default || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                    placeholder={field.default || ''}
                    required={field.required}
                  />
                  {field.hint && (
                    <p className="text-xs text-gray-500 mt-1">{field.hint}</p>
                  )}
                </div>
              ))}

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={connecting}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? 'Connecting...' : 'Connect'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
