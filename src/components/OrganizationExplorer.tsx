import React, { useState } from 'react'
import { Instagram, Twitter, Globe, FileText, ExternalLink } from 'lucide-react'
import './OrganizationExplorer.css'

// 학회 정보 타입 정의
interface Organization {
  id: string
  name: string
  logo?: string // 로고 이미지 URL (선택적)
  description: string
  category: string
  instagram?: string
  twitter?: string
  websites?: string[]
  pdfs?: { title: string; url: string }[]
}

// 학회 데이터
const ORGANIZATIONS: Organization[] = [
  {
    id: 'insiders',
    name: 'INSIDERS',
    logo: '/insiders.jpg', // 로고 이미지 경로
    description: '연세대•고려대 연합 실전창업학회 INSIDERS',
    category: '주최기관',
    instagram: 'https://www.instagram.com/insiders_mafia/',
    websites: ['https://insiders.co.kr'],
    pdfs: []
  },
  {
    id: 'snusv',
    name: 'SNUSV',
    logo: '/snusv.jpg', // 로고 이미지 경로
    description: '서울대학교 학생 벤처 네트워크',
    category: '주최기관',
    instagram: 'https://www.instagram.com/snusv.net_/',
    websites: ['https://snusv.net'],
    pdfs: []
  },
  {
    id: 'aiku',
    name: 'AIKU',
    logo: '/aiku.jpg',
    description: '고려대학교 정보대학 소속 딥러닝 학회 AIKU',
    category: '협력기관',
    instagram: 'https://www.instagram.com/aiku._.official/',
    websites: ['https://aiku.oopy.io/?fbclid=PAVERFWAMS3eNleHRuA2FlbQIxMQABp-c3d9EhByEr9xKlzkgWKihX5-RHsyP2NOZgH7DFoCu9p-wMPf9NUR5n7aIM_aem_sNHl9-Rz-rd95HmzHieezQ'],
    pdfs: []
  },
  {
    id: 'sigma',
    name: '시그마',
    logo: '/sigma.jpg',
    description: '서울대학교 전기정보공학부 로봇동아리',
    category: '협력기관',
    instagram:'https://www.instagram.com/sigma_intelligence_/',
    pdfs: []
  },
  {
    id: 'blockchain-valley',
    name: 'Blockchain Valley',
    logo: '/blockchainvalley.jpg',
    description: '고려대학교 기반 블록체인 학회',
    category: '협력기관',
    instagram: 'https://www.instagram.com/blockchain__valley/',
    twitter:'https://x.com/blockchainkor',
    websites: ['https://blockchainvalley.notion.site/8-2330e7970a3c80c393b2e6a08fbb9913','https://blog.blockchainvalley.ac/'],
    pdfs: []
  },
  {
    id: 'blockchain-yonsei',
    name: 'Blockchain at Yonsei',
    logo: 'blockchainatyonsei.jpg',
    description: 'Blockchain at Yonsei / BAY',
    category: '협력기관',
    instagram:'https://www.instagram.com/blockchain_at_yonsei/',
    twitter:'https://x.com/BlockchainatYU',
    websites: [],
    pdfs: [{title:'BAY 소개 자료',url:'bcypt.pdf'}]
  },
  {
    id: 'kasimov',
    name: 'Kasimov',
    logo: 'kasimov.jpg',
    description: '고려대학교 기계공학부 지능로봇소모임',
    category: '협력기관',
    instagram:'https://www.instagram.com/kasimov_ku',
    websites: ['https://www.notion.so/kasimov/KASIMOV-643a0c42c87d4d8186b189af18d3c7e3'],
    pdfs: []
  },
  {
    id: 'likelion-yonsei',
    name: '연세대 멋쟁이 사자처럼',
    logo: 'likelionyonsei.jpg',
    description: '멋쟁이사자처럼 at 연세대학교',
    category: '협력기관',
    instagram: 'https://www.instagram.com/likelion_yonsei/',
    pdfs: []
  }
]

interface OrganizationModalProps {
  organization: Organization | null
  onClose: () => void
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({ organization, onClose }) => {
  if (!organization) return null

  return (
    <div className="organization-modal-overlay" onClick={onClose}>
      <div className="organization-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <div className="modal-logo">
            {organization.logo ? (
              <img src={organization.logo} alt={organization.name} />
            ) : (
              <span>{organization.name}</span>
            )}
          </div>
          <h2>{organization.name}</h2>
          <span className="modal-category">{organization.category}</span>
        </div>

        <div className="modal-body">
          <p className="modal-description">{organization.description}</p>

          {/* 소셜 미디어 & 웹사이트 */}
          {(organization.instagram || organization.twitter || (organization.websites && organization.websites.length > 0)) && (
            <div className="modal-section">
              <h3>링크</h3>
              <div className="modal-links">
                {organization.instagram && (
                  <a href={organization.instagram} target="_blank" rel="noopener noreferrer" className="modal-link">
                    <Instagram size={20} />
                    <span>Instagram</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                {organization.twitter && (
                  <a href={organization.twitter} target="_blank" rel="noopener noreferrer" className="modal-link">
                    <Twitter size={20} />
                    <span>Twitter</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                {organization.websites && organization.websites.map((website, index) => (
                  <a key={index} href={website} target="_blank" rel="noopener noreferrer" className="modal-link">
                    <Globe size={20} />
                    <span>웹사이트 {organization.websites!.length > 1 ? `${index + 1}` : ''}</span>
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* PDF 자료 */}
          {organization.pdfs && organization.pdfs.length > 0 && (
            <div className="modal-section">
              <h3>소개 자료</h3>
              <div className="modal-pdfs">
                {organization.pdfs.map((pdf, index) => (
                  <a key={index} href={pdf.url} target="_blank" rel="noopener noreferrer" className="modal-pdf">
                    <FileText size={20} />
                    <span>{pdf.title}</span>
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const OrganizationExplorer: React.FC = () => {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredOrganizations = filterCategory === 'all'
    ? ORGANIZATIONS
    : ORGANIZATIONS.filter(org => org.category === filterCategory)

  return (
    <div className="organization-explorer">
      <div className="explorer-header">
        <h1>학회 탐색</h1>
        <p>YTTF 2025에 참여하는 학회들을 탐색해보세요</p>
      </div>

      {/* 필터 */}
      <div className="organization-filters">
        <button
          className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          전체
        </button>
        <button
          className={`filter-btn ${filterCategory === '주최기관' ? 'active' : ''}`}
          onClick={() => setFilterCategory('주최기관')}
        >
          주최기관
        </button>
        <button
          className={`filter-btn ${filterCategory === '협력기관' ? 'active' : ''}`}
          onClick={() => setFilterCategory('협력기관')}
        >
          협력기관
        </button>
      </div>

      {/* 학회 그리드 */}
      <div className="organizations-grid">
        {filteredOrganizations.map((org) => (
          <div
            key={org.id}
            className="organization-card"
            onClick={() => setSelectedOrg(org)}
          >
            <div className="org-card-logo">
              {org.logo ? (
                <img src={org.logo} alt={org.name} />
              ) : (
                <span>{org.name}</span>
              )}
            </div>
            <h3>{org.name}</h3>
            <span className="org-category">{org.category}</span>
            <p className="org-description">{org.description}</p>

            <div className="org-links-preview">
              {org.instagram && <Instagram size={16} />}
              {org.twitter && <Twitter size={16} />}
              {org.websites && org.websites.length > 0 && <Globe size={16} />}
              {org.pdfs && org.pdfs.length > 0 && <FileText size={16} />}
            </div>
          </div>
        ))}
      </div>

      {/* 상세 모달 */}
      <OrganizationModal organization={selectedOrg} onClose={() => setSelectedOrg(null)} />
    </div>
  )
}

export default OrganizationExplorer
