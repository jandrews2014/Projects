/// <summary>
/// m_Enemy_Example
/// Script Writte by Briner Lovo
/// any question please contact to my email: brinerjhonson.lc@gmail.com
/// </summary>

using UnityEngine;
using System.Collections;

public class m_Enemy_Example : MonoBehaviour {

    [Header("Enemy Turrent")]
	public Transform m_Target ;
    public Transform Spawn_Position;
    public Transform Canon;
    [Space(5)]
    public string m_TargetTag = "Player";
    [Space(5)]
	public Rigidbody bulletPrefab;
    [Space(5)]
	float  nextShotTime = 0.0f;
	public float  m_Rate = 2.0f;
    public float m_Force = 2000;
    public float AmountRotation;
    public float RateRotation = 5;
    public float damp = 6.0f;
    private float NextRate = 0.0f;
    private Vector3 NextPos;


	void Update()
	{
        if (m_Target)
        {
            if (Canon.GetComponent<LineRenderer>().enabled == true)
            {
                Canon.GetComponent<LineRenderer>().enabled = false;
            }
            StopAllCoroutines();
            Canon.transform.LookAt(m_Target.position);
            Spawn_Position.transform.LookAt(m_Target);
            Quaternion rotate = Quaternion.LookRotation(m_Target.position - transform.position);
            transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * damp);

            if (nextShotTime <= Time.time)
            {
                Shoot();
                nextShotTime = Time.time + m_Rate;
            }
        }
        else
        {
            if(Time.time > NextRate){
                NextRate = Time.time + RateRotation;
                GetNextPos();
            }
            if (Canon.GetComponent<LineRenderer>().enabled == false)
            {
                Canon.GetComponent<LineRenderer>().enabled = true;
            }
            Quaternion qua = Quaternion.Euler(NextPos);
            Canon.transform.rotation = Quaternion.Lerp(Canon.transform.rotation, qua, Time.deltaTime );
        }
        SearchPlayer();
	}

    void GetNextPos()
    {
        NextPos = new Vector3(0, Random.Range(-AmountRotation, AmountRotation), 0);
    }

	void Shoot()
	{
		Rigidbody bullet = Instantiate(bulletPrefab, Spawn_Position.transform.position, Quaternion.identity)as Rigidbody;
		bullet.GetComponent<Rigidbody>().AddForce(transform.forward * m_Force);

		m_Bullet_Example Bullet_ = bullet.GetComponent<m_Bullet_Example> ();
		if (Bullet_ != null) {
			Bullet_.m_Owner_Position = transform;
				}
	}

    void SearchPlayer()
    {
        if (GameObject.FindWithTag(m_TargetTag) != null)
        {
            m_Target = GameObject.FindWithTag(m_TargetTag).transform;
        }
    }
}
