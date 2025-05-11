import Document from '#models/document'
export interface DocumentParams {
  id: string
  userId: string
}

export interface FindAllParams {
  userId: string
}

export interface UpdateDocumentParams extends DocumentParams {
  data: Partial<Document>
}

/**
 * Service de gestion des documents
 * @class DocumentService
 */
export default class DocumentService {
  /**
   * Recherche un document par son identifiant
   * @param {DocumentParams} params - Les paramètres de recherche
   * @returns {Promise<Document | null>} Le document trouvé ou null
   */
  async find({ id, userId }: DocumentParams): Promise<Document | null> {
    return Document.query()
      .where('id', id)
      .where('user_id', userId)
      .first()
  }

  /**
   * Recherche un document par son identifiant et lance une exception si non trouvé
   * @param {DocumentParams} params - Les paramètres de recherche
   * @returns {Promise<Document>} Le document trouvé
   * @throws {Error} Si le document n'est pas trouvé
   */
  async findOrFail({ id, userId }: DocumentParams): Promise<Document> {
    return Document.query()
      .where('id', id)
      .where('user_id', userId)
      .firstOrFail()
  }

  /**
   * Récupère tous les documents d'un utilisateur
   * @param {FindAllParams} params - Les paramètres de recherche
   * @returns {Promise<Document[]>} Liste des documents de l'utilisateur
   */
  async findAll({ userId }: FindAllParams): Promise<Document[]> {
    return Document.query()
      .where('user_id', userId)
      .withScopes((scopes) => scopes.withoutDeleted())
      .orderBy('created_at', 'desc')
  }

  /**
   * Récupère tous les documents d'un utilisateur spécifique
   * @param {string} userId - L'identifiant de l'utilisateur
   * @returns {Promise<Document[]>} Liste des documents de l'utilisateur
   */
  async findByUser(userId: string): Promise<Document[]> {
    return Document.query().where('user_id', userId)
  }

  /**
   * Crée un nouveau document
   * @param {Partial<Document>} data - Les données du document à créer
   * @returns {Promise<Document>} Le document créé
   */
  async create(data: Partial<Document>): Promise<Document> {
    return Document.create(data)
  }

  /**
   * Crée plusieurs documents en une seule opération
   * @param {Partial<Document>[]} dataArray - Tableau des données des documents à créer
   * @returns {Promise<Document[]>} Les documents créés
   */
  async createMany(dataArray: Partial<Document>[]): Promise<Document[]> {
    return Document.createMany(dataArray)
  }

  /**
   * Met à jour un document existant
   * @param {UpdateDocumentParams} params - Les paramètres de mise à jour
   * @returns {Promise<Document | null>} Le document mis à jour ou null si non trouvé
   */
  async update({ id, userId, data }: UpdateDocumentParams): Promise<Document | null> {
    const document = await this.find({ id, userId })
    if (!document) return null

    return document.merge(data).save()
  }

  /**
   * Supprime un document
   * @param {DocumentParams} params - Les paramètres de suppression
   * @returns {Promise<boolean>} true si la suppression a réussi, false sinon
   */
  async delete({ id, userId }: DocumentParams): Promise<boolean> {
    const document = await this.find({ id, userId })
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
    return Document.query().paginate(page, limit)
  }
}
