import Document from '#models/document'

/**
 * Service de gestion des documents
 * @class DocumentService
 */
export default class DocumentService {
  /**
   * Recherche un document par son identifiant
   * @param {number} id - L'identifiant du document
   * @returns {Promise<Document | null>} Le document trouvé ou null
   */
  async find(id: number): Promise<Document | null> {
    return await Document.find(id)
  }

  /**
   * Récupère tous les documents
   * @returns {Promise<Document[]>} Liste de tous les documents
   */
  async findAll(): Promise<Document[]> {
    return await Document.query()
      .withScopes((scopes) => scopes.withoutDeleted())
      .orderBy('created_at', 'desc')
  }

  /**
   * Récupère tous les documents d'un utilisateur spécifique
   * @param {number} userId - L'identifiant de l'utilisateur
   * @returns {Promise<Document[]>} Liste des documents de l'utilisateur
   */
  async findByUser(userId: number): Promise<Document[]> {
    return await Document.query().where('user_id', userId)
  }

  /**
   * Crée un nouveau document
   * @param {Partial<Document>} data - Les données du document à créer
   * @returns {Promise<Document>} Le document créé
   */
  async create(data: Partial<Document>): Promise<Document> {
    return await Document.create(data)
  }

  /**
   * Crée plusieurs documents en une seule opération
   * @param {Partial<Document>[]} dataArray - Tableau des données des documents à créer
   * @returns {Promise<Document[]>} Les documents créés
   */
  async createMany(dataArray: Partial<Document>[]): Promise<Document[]> {
    return await Document.createMany(dataArray)
  }

  /**
   * Met à jour un document existant
   * @param {number} id - L'identifiant du document à mettre à jour
   * @param {Partial<Document>} data - Les nouvelles données du document
   * @returns {Promise<Document | null>} Le document mis à jour ou null si non trouvé
   */
  async update(id: number, data: Partial<Document>): Promise<Document | null> {
    const document = await this.find(id)
    if (!document) return null

    return await document.merge(data).save()
  }

  /**
   * Supprime un document
   * @param {number} id - L'identifiant du document à supprimer
   * @returns {Promise<boolean>} true si la suppression a réussi, false sinon
   */
  async delete(id: number): Promise<boolean> {
    const document = await this.find(id)
    if (!document) return false

    await document.delete()
    return true
  }

  /**
   * Récupère les documents avec pagination
   * @param {number} [page=1] - Le numéro de la page
   * @param {number} [limit=10] - Le nombre d'éléments par page
   * @returns {Promise<any>} Les documents paginés avec leurs métadonnées
   */
  async paginate(page: number = 1, limit: number = 10): Promise<any> {
    return await Document.query().paginate(page, limit)
  }
}
