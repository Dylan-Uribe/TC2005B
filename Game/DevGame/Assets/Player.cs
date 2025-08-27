using UnityEditor.Tilemaps;
using UnityEngine;
using UnityEngine.Rendering;

//El nombre de la clase debe ser el mismo del de Unity
public class Player : MonoBehaviour
{
    //Inicializar variables
    Animator animator;
    Rigidbody2D body;
    AudioSource sfx;
    public AudioClip[] clips;
    float mov;
    bool seeRight = true;
    public bool jump = true;
    public Transform feet;
    float fuerzaSalto = 50f;
    public LayerMask whatIsGround;
    float feetSize = 0.2f;

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        //(conectar todas las propiedades del animator)
        animator = GetComponent<Animator>();
        //Busca en tu inspector un componente RidigBody
        body = GetComponent<Rigidbody2D>();
        //Busca en tu inspector un componente AudioSource
        sfx = GetComponent<AudioSource>();
    }

    // Update is called once per frame
    //Ejecutado cada cuadro por segundo (60)
    void Update()
    {
        //Unity evalua si 2 objetos están colisionando.
        jump = !Physics2D.OverlapCircle(feet.position, whatIsGround);

        if (Input.GetKey(KeyCode.K)) 
        {
            animator.Play("PlayerPunch");
            sfx.clip = clips[1];
            sfx.Play();
        }

        if (Input.GetKey(KeyCode.UpArrow) && !jump) 
        {
            body.AddForce(new Vector2(0f, fuerzaSalto));
            sfx.clip = clips[0];
            sfx.Play();
        }

        mov = Input.GetAxis("Horizontal");
        animator.SetFloat("MOV", Mathf.Abs(mov));
        animator.SetBool("JUMP", jump);
        animator.SetFloat("ALTURA", body.linearVelocity.y);
        body.linearVelocity = new Vector2(mov*5,body.linearVelocity.y);

        if (seeRight && mov < 0) 
        {
            Flip();
        }

        if (!seeRight && mov > 0) 
        {
            Flip();
        }
    }

    void Flip() 
    {
        seeRight = !seeRight;
        Vector3 scale = transform.localScale; //valores del transform de x,y,z
        scale.x *= -1;
        transform.localScale = scale;
    }
}
