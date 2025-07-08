// PUT /applications/:id
export const updateApplication = async (req, res) => {
  console.log(req);
  const applicationId = req.params.id;
  const { status, notes } = req.body;
  if (typeof status === 'undefined' && typeof notes === 'undefined') {
    return res.status(400).json({ error: 'Güncellenecek alan yok.' });
  }
  try {
    const result = await sql`
      UPDATE applications SET
        status = COALESCE(${status}, status),
        notes = COALESCE(${notes}, notes),
        updated_at = NOW()
      WHERE id = ${applicationId}
      RETURNING *
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }
    const app = result[0];
    res.status(200).json({
      message: 'Başvuru güncellendi',
      application: {
        id: app.id,
        projectId: app.project_id,
        name: app.name,
        email: app.email,
        phone: app.phone,
        status: app.status,
        notes: app.notes,
        message: app.message,
        createdAt: app.created_at,
        updatedAt: app.updated_at
      }
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: error.detail || 'Internal server error' });
  }
};
import { sql } from '../config/db.js';

export const getAllApplications = async (req, res) => {
  try {
    const applications = await sql`
      SELECT a.*, p.name as project_name
      FROM applications a
      LEFT JOIN projects p ON a.project_id = p.id
      ORDER BY a.updated_at DESC
    `;
    const mappedApplications = applications.map(app => ({
      id: app.id,
      projectId: app.project_id,
      projectName: app.project_name || null,
      name: app.name,
      email: app.email,
      phone: app.phone,
      status: app.status,
      notes: app.notes,
      message: app.message,
      createdAt: app.created_at,
      updatedAt: app.updated_at
    }));
    res.status(200).json(mappedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// POST /applications
export const createApplication = async (req, res) => {
  const { projectId, name, phone, email, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Ad Soyad ve Telefon zorunludur.' });
  }
  try {
    const result = await sql`
      INSERT INTO applications (
        project_id,
        name,
        email,
        phone,
        message
      )
      VALUES (
        ${projectId},
        ${name},
        ${email},
        ${phone},
        ${message}
      )
      RETURNING *
    `;
    const app = result[0];
    res.status(201).json({
      message: 'Başvurunuz alındı',
      application: {
        id: app.id,
        projectId: app.project_id,
        name: app.name,
        email: app.email,
        phone: app.phone,
        status: app.status,
        message: app.message,
        createdAt: app.created_at,
        updatedAt: app.updated_at
      }
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: error.detail || 'Internal server error' });
  }
};
